/* eslint-disable indent */
import { Role, WsEvents } from '@common/domain/enums'
import { WsAuthGuard } from '@common/guards'
import { CallService } from '@modules/calls/calls.service'
import { CallFormatted } from '@modules/calls/entities'
import { PatientWs } from '@modules/patients/decorators'
import { PatientFormatted } from '@modules/patients/entities'
import { ScheduleFormatted } from '@modules/schedules/entities'
import { ScheduleRepository } from '@modules/schedules/repositories'
import { SpecialistWs } from '@modules/specialists/decorators'
import { SpecialistFormatted } from '@modules/specialists/entities'
import { Logger, UseGuards } from '@nestjs/common'
import {
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

@WebSocketGateway({ namespace: 'video-call', cors: true })
export class VideoCallGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	@WebSocketServer() server!: Server
	private logger: Logger = new Logger('VideoCallGateway')
	public patients: (PatientFormatted & { socketId: string })[] = []
	public specialists: (SpecialistFormatted & { socketId: string })[] = []
	public rooms: string[] = []

	constructor(
		private readonly scheduleRepository: ScheduleRepository,
		private readonly callService: CallService
	) {}

	public afterInit(): void {
		return this.logger.warn(`Websocket namespace running in: /video-call`)
	}

	public handleDisconnect(client: Socket): void {
		return this.logger.log(`Client disconnected: ${client.id}`)
	}

	public handleConnection(client: Socket): void {
		return this.logger.log(`Client connected: ${client.id}`)
	}

	private getSockets(patientId: number, specialistId: number) {
		const patientSocket = this.patients.find(({ id }) => patientId === id)
		const specialistSocket = this.specialists.find(({ id }) => specialistId === id)

		return { patientSocket, specialistSocket }
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
			return client.emit(WsEvents.ME, newPatient)
		}

		if (specialist) {
			const newSpecialist = { ...specialist, socketId: client.id }

			this.specialists.push(newSpecialist)

			return client.emit(WsEvents.ME, newSpecialist)
		}

		return
	}

	async sendUsersCall(data: {
		scheduleId: number
		patientId: number
		specialistId: number
	}) {
		const { scheduleId, patientId, specialistId } = data

		const { patientSocket, specialistSocket } = this.getSockets(patientId, specialistId)

		if (!patientSocket || !specialistSocket) {
			return
		}

		this.server
			.to(patientSocket.socketId)
			.to(specialistSocket.socketId)
			.emit(WsEvents.SEND_USERS_CALL, { scheduleId })
	}

	async sendCallCloseNotification(scheduleId: number) {
		const foundSchedule = await this.scheduleRepository.getById(scheduleId)

		const { specialistId, patientId } = foundSchedule

		const { patientSocket, specialistSocket } = this.getSockets(
			patientId as number,
			specialistId
		)

		if (!patientSocket && !specialistSocket) {
			return
		}

		this.server.to(`room-${scheduleId}`).emit(WsEvents.SEND_CLOSE_NOTIFICATION)
	}

	@SubscribeMessage(WsEvents.SEND_MESSAGE)
	@UseGuards(WsAuthGuard)
	sendMessage(
		@MessageBody()
		messageData: {
			createdAt: Date
			msg: string
			room: string
		},
		@ConnectedSocket() client: Socket
	) {
		const { createdAt, msg, room } = messageData

		const userRole = client.handshake.auth.role

		const sender =
			userRole === Role.Patient
				? this.patients.find(({ socketId }) => socketId === client.id)
				: this.specialists.find(({ socketId }) => socketId === client.id)

		this.server.to(room).emit(WsEvents.RECEIVE_MESSAGE, {
			id: client.id,
			name: sender?.name,
			createdAt,
			msg
		})
	}

	@SubscribeMessage(WsEvents.UPDATE_MEDIA)
	@UseGuards(WsAuthGuard)
	updateMedia(
		@MessageBody()
		data: {
			type: 'audio' | 'video'
			currentMediaStatus: { type: 'mic' | 'video'; status: boolean }
			room: string
		}
	) {
		const { room } = data

		this.server.to(room).emit(WsEvents.UPDATE_USER_MEDIA, data)
	}

	@SubscribeMessage(WsEvents.ENTER_CALL)
	@UseGuards(WsAuthGuard)
	enterCall(
		@MessageBody() data: { room: string; signalData: any },
		@ConnectedSocket() client: Socket
	) {
		const { signalData, room } = data

		const { auth } = client.handshake

		this.server.to(room).emit(WsEvents.RECEIVE_CALL, {
			signal: signalData,
			from: client.id,
			name: auth.name,
			avatarUrl: auth.avatarUrl
		})
	}

	@SubscribeMessage(WsEvents.END_CALL)
	async endCall(
		data: Pick<ScheduleFormatted, 'patientId' | 'specialistId'> &
			Pick<CallFormatted, 'duration' | 'scheduleId' | 'rating'>
	) {
		const { patientId, specialistId, duration, scheduleId, rating } = data

		if (!patientId) {
			return
		}

		const { patientSocket, specialistSocket } = this.getSockets(patientId, specialistId)

		await this.callService.create({
			scheduleId,
			duration,
			rating
		})

		if (patientSocket) {
			this.server.to(patientSocket.socketId).emit(WsEvents.END_CALL)
		}

		if (specialistSocket) {
			this.server.to(specialistSocket.socketId).emit(WsEvents.END_CALL)
		}
	}
}
