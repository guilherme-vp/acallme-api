/* eslint-disable indent */
import { Role, WsEvents } from '@common/domain/enums'
import { WsAuthGuard } from '@common/guards'
import { CallService } from '@modules/calls/calls.service'
import { Call } from '@modules/calls/entities'
import { PatientWs } from '@modules/patients/decorators'
import { Patient } from '@modules/patients/entities'
import { SpecialistWs } from '@modules/specialists/decorators'
import { Specialist } from '@modules/specialists/entities'
import { Logger, UseFilters, UseGuards } from '@nestjs/common'
import {
	BaseWsExceptionFilter,
	ConnectedSocket,
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'

@UseFilters(new BaseWsExceptionFilter())
@WebSocketGateway({ namespace: 'videocall', cors: true })
export class VideoCallGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	@WebSocketServer() server!: Server
	private logger: Logger = new Logger('VideoCallGateway')
	public patients: (Patient & { socketId: string })[] = []
	public specialists: (Specialist & { socketId: string })[] = []
	public rooms: Array<{ name: string; peers: any[] }> = []

	constructor(private readonly callService: CallService) {}

	public afterInit(): void {
		return this.logger.warn(`Websocket namespace running in: /video-call`)
	}

	public handleDisconnect(client: Socket): void {
		return this.logger.log(`Client disconnected: ${client.id}`)
	}

	public handleConnection(client: Socket): void {
		return this.logger.log(`Client connected: ${client.id}`)
	}

	@UseGuards(WsAuthGuard)
	@SubscribeMessage(WsEvents.ME)
	me(
		@ConnectedSocket() client: Socket,
		@PatientWs() patient: Patient,
		@SpecialistWs() specialist: Specialist
	) {
		if (patient) {
			const newPatient = { ...patient, socketId: client.id }

			this.patients.push(newPatient)
			this.logger.log(newPatient, 'A new patient entered')
			return client.emit(WsEvents.ME, client.id)
		}

		if (specialist) {
			const newSpecialist = { ...specialist, socketId: client.id }

			this.specialists.push(newSpecialist)
			this.logger.log(newSpecialist, 'A new specialist entered')
			return client.emit(WsEvents.ME, client.id)
		}

		return
	}

	sendCallCloseNotification(scheduleId: number) {
		this.logger.warn({ scheduleId }, 'Sending close notification to room')
		this.server.to(`room-${scheduleId}`).emit(WsEvents.SEND_CLOSE_NOTIFICATION)
	}

	@SubscribeMessage(WsEvents.SEND_MESSAGE)
	@UseGuards(WsAuthGuard)
	sendMessage(
		@MessageBody()
		messageData: {
			avatarUrl?: string
			createdAt: Date
			message: string
			room: string
		},
		@ConnectedSocket() client: Socket
	) {
		const { room, ...data } = messageData

		const { role: userRole } = client.handshake.auth

		const sender =
			userRole === Role.Patient
				? this.patients.find(({ socketId }) => socketId === client.id)
				: this.specialists.find(({ socketId }) => socketId === client.id)

		this.server.to(room).emit(WsEvents.RECEIVE_MESSAGE, {
			...data,
			id: client.id,
			name: sender?.name
		})
	}

	@SubscribeMessage(WsEvents.UPDATE_MEDIA)
	@UseGuards(WsAuthGuard)
	updateMedia(
		@MessageBody()
		data: {
			type: 'audio' | 'video' | 'both'
			statuses: boolean[]
			room: string
		},
		@ConnectedSocket() client: Socket
	) {
		const { room, ...rest } = data

		this.logger.log({ room }, 'Emitting updated media to room')

		this.server
			.to(room)
			.emit(WsEvents.RECEIVE_UPDATED_MEDIA, { ...rest, socketId: client.id })
	}

	@SubscribeMessage(WsEvents.ENTER_CALL)
	// @UseGuards(WsAuthGuard)
	enterCall(
		@MessageBody()
		data: {
			room: string
			signal: any
			mediaStatus: { video?: boolean; audio?: boolean }
		},
		@ConnectedSocket() client: Socket
	) {
		const { mediaStatus, signal, room } = data

		const { auth } = client.handshake

		const roomIndex = this.rooms.findIndex(({ name }) => name === room)

		if (roomIndex === -1) {
			this.logger.log({ room, signal }, 'Creating room with given signal')
			this.rooms.push({ name: room, peers: [signal] })
		} else {
			const roomPosition = this.rooms[roomIndex]

			this.logger.log({ room, signal }, 'Adding peer and signal to room')
			this.rooms[roomIndex] = {
				...roomPosition,
				peers: [...roomPosition.peers, signal]
			}
		}

		this.logger.log('Adding socket to room')
		client.join(room)

		this.logger.warn('Emitting ENTER CALL event to room')
		this.server.to(room).emit(WsEvents.ENTER_CALL, {
			socketId: client.id,
			signal,
			name: auth.name,
			avatarUrl: auth.avatarUrl,
			mediaStatus,
			signals: this.rooms.find(({ name }) => name === room)?.peers
		})
	}

	@SubscribeMessage(WsEvents.END_CALL)
	async endCall(@MessageBody() data: Pick<Call, 'duration' | 'scheduleId' | 'rating'>) {
		const { duration, scheduleId, rating } = data

		await this.callService.create({
			scheduleId,
			duration,
			rating
		})

		this.server.to(`room-${scheduleId}`).emit(WsEvents.END_CALL)
	}
}
