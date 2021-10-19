/* eslint-disable indent */
import { WsEvents } from '@common/domain/enums'
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
			client.emit(WsEvents.ME, newPatient)
		} else {
			const newSpecialist = { ...specialist, socketId: client.id }

			this.specialists.push(newSpecialist)

			client.emit(WsEvents.ME, newSpecialist)
		}
	}

	async sendUsersCall(data: {
		scheduleId: number
		patientId: number
		specialistId: number
	}) {
		const { scheduleId, patientId, specialistId } = data

		const patient = this.patients.find(({ id }) => patientId === id)
		const specialist = this.specialists.find(({ id }) => specialistId === id)

		if (!patient || !specialist) {
			return
		}

		this.server
			.to(patient.socketId)
			.to(specialist.socketId)
			.emit(WsEvents.SEND_USERS_CALL, { scheduleId })
	}

	async sendCallCloseNotification(call: CallFormatted) {
		const { scheduleId } = call

		const foundSchedule = await this.scheduleRepository.getById(scheduleId)

		const { specialistId, patientId } = foundSchedule

		const { patientSocket, specialistSocket } = this.getSockets(
			patientId as number,
			specialistId
		)

		if (!patientSocket || !specialistSocket) {
			return
		}

		this.server
			.to(patientSocket.socketId)
			.to(specialistSocket.socketId)
			.emit(WsEvents.SEND_NOTIFICATION)
	}

	async sendCallNotifications(schedule: ScheduleFormatted) {
		const { specialistId, patientId } = schedule

		const { patientSocket, specialistSocket } = this.getSockets(
			patientId as number,
			specialistId
		)

		if (patientSocket) {
			this.server.to(patientSocket.socketId).emit(WsEvents.SEND_NOTIFICATION, {
				specialist: specialistSocket,
				date: schedule.rangeStart
			})
		}

		if (specialistSocket) {
			this.server.to(specialistSocket.socketId).emit(WsEvents.SEND_NOTIFICATION, {
				patientSocket,
				date: schedule.rangeStart,
				confirmed: schedule.confirmed
			})
		}
	}

	@SubscribeMessage(WsEvents.UPDATE_MEDIA)
	updateMyMedia(@MessageBody() mediaData: any) {
		this.server.send(WsEvents.UPDATE_USER_MEDIA, mediaData)
	}

	@SubscribeMessage(WsEvents.SEND_MESSAGE)
	sendMessage(
		@MessageBody()
		messageData: {
			name: string
			createdAt: Date
			to: string
			msg: string
			sender: string
		}
	) {
		const { name, createdAt, to, msg, sender } = messageData

		this.server.to(to).emit(WsEvents.RECEIVE_MESSAGE, { name, createdAt, msg, sender })
	}

	@SubscribeMessage(WsEvents.ANSWER_CALL)
	answerCall(
		@MessageBody() data: { type: 'audio' | 'video'; to: string; currentMediaStatus: any }
	) {
		const { type, to, currentMediaStatus } = data

		this.server.send(WsEvents.UPDATE_USER_MEDIA, {
			type,
			currentMediaStatus
		})

		this.server.to(to).emit('callAccepted', data)
	}

	@SubscribeMessage(WsEvents.RECEIVE_CALL)
	callUser(
		@MessageBody() data: { userToCall: string; signalData: any; from: string; name: string }
	) {
		const { from, name, signalData, userToCall } = data
		this.server
			.to(userToCall)
			.emit(WsEvents.RECEIVE_CALL, { signal: signalData, from, name })
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
