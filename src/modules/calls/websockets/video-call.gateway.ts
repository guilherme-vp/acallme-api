/* eslint-disable indent */
import { Role, WsEvents } from '@common/domain/enums'
import { WsAuthGuard } from '@common/guards'
import { CallService } from '@modules/calls/calls.service'
import { CallFormatted } from '@modules/calls/entities'
import { PatientWs } from '@modules/patients/decorators'
import { PatientFormatted } from '@modules/patients/entities'
import { SpecialistWs } from '@modules/specialists/decorators'
import { SpecialistFormatted } from '@modules/specialists/entities'
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
@WebSocketGateway(4443, { namespace: 'videocall', cors: true })
export class VideoCallGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	@WebSocketServer() server!: Server
	private logger: Logger = new Logger('VideoCallGateway')
	public patients: (PatientFormatted & { socketId: string })[] = []
	public specialists: (SpecialistFormatted & { socketId: string })[] = []
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
		@PatientWs() patient: PatientFormatted,
		@SpecialistWs() specialist: SpecialistFormatted
	) {
		if (patient) {
			const newPatient = { ...patient, socketId: client.id }

			this.patients.push(newPatient)
			return client.emit(WsEvents.ME, client.id)
		}

		if (specialist) {
			const newSpecialist = { ...specialist, socketId: client.id }

			this.specialists.push(newSpecialist)

			return client.emit(WsEvents.ME, client.id)
		}

		return
	}

	sendCallCloseNotification(scheduleId: number) {
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

		const userRole = client.handshake.auth.role

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

		this.server.to(room).emit(WsEvents.UPDATE_USER_MEDIA, { ...rest, socketId: client.id })
	}

	@SubscribeMessage(WsEvents.ENTER_CALL)
	@UseGuards(WsAuthGuard)
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
			this.rooms.push({ name: room, peers: [signal] })
		} else {
			const roomPosition = this.rooms[roomIndex]

			this.rooms[roomIndex] = {
				...roomPosition,
				peers: [...roomPosition.peers, signal]
			}
		}

		client.join(room)

		this.server.to(room).emit(WsEvents.RECEIVE_USER, {
			socketId: client.id,
			signal,
			name: auth.name,
			avatarUrl: auth.avatarUrl,
			mediaStatus,
			signals: this.rooms.find(({ name }) => name === room)?.peers
		})
	}

	@SubscribeMessage(WsEvents.END_CALL)
	async endCall(data: Pick<CallFormatted, 'duration' | 'scheduleId' | 'rating'>) {
		const { duration, scheduleId, rating } = data

		await this.callService.create({
			scheduleId,
			duration,
			rating
		})

		this.server.to(`room-${scheduleId}`).emit(WsEvents.END_CALL)
	}
}
