/* eslint-disable indent */
import { WsEvents } from '@common/domain/enums'
import { WsAuthGuard } from '@common/guards'
import { PatientWs } from '@modules/patients/decorators'
import { PatientFormatted } from '@modules/patients/entities'
import { ScheduleFormatted } from '@modules/schedules/entities'
import { SpecialistWs } from '@modules/specialists/decorators'
import { SpecialistFormatted } from '@modules/specialists/entities'
import { SpecialistService } from '@modules/specialists/specialists.service'
import { Logger, UseFilters, UseGuards } from '@nestjs/common'
import {
	BaseWsExceptionFilter,
	ConnectedSocket,
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer
} from '@nestjs/websockets'
import faker from 'faker'
import { Server, Socket } from 'socket.io'

import { Notification } from '../domain/entities'

@UseFilters(new BaseWsExceptionFilter())
@WebSocketGateway({ cors: true })
export class NotificationGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	constructor(private readonly specialistService: SpecialistService) {}

	@WebSocketServer() server!: Server
	private logger: Logger = new Logger('NotificationGateway')

	public patients: (PatientFormatted & { socketId: string })[] = []
	public specialists: (SpecialistFormatted & { socketId: string })[] = []

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

	sendCallNotifications(schedule: ScheduleFormatted) {
		const { id, specialistId, patientId } = schedule

		const { patientSocket, specialistSocket } = this.getSockets(
			patientId as number,
			specialistId
		)

		if (patientSocket) {
			this.server.to(patientSocket.socketId).emit(WsEvents.SEND_NOTIFICATION, {
				id: faker.datatype.uuid(),
				createdAt: new Date(),
				type: 'appointment_call',
				scheduleId: id
			} as Notification)
		}

		if (specialistSocket) {
			this.server.to(specialistSocket.socketId).emit(WsEvents.SEND_NOTIFICATION, {
				id: faker.datatype.uuid(),
				createdAt: new Date(),
				type: 'appointment_call',
				scheduleId: id
			} as Notification)
		}
	}

	sendAppointmentConfirmation(schedule: ScheduleFormatted) {
		const { id, patientId, rangeStart, confirmed } = schedule

		const patientSocket = this.patients.find(patient => patient.id === patientId)

		if (!patientSocket) {
			// TODO: send email
			return
		}

		this.server.to(patientSocket.socketId).emit(WsEvents.SEND_NOTIFICATION, {
			id: faker.datatype.uuid(),
			createdAt: new Date(),
			type: 'appointment_confirmation',
			scheduleId: id,
			isConfirmed: confirmed,
			when: rangeStart
		} as Notification)
	}

	async sendNewAppointment(schedule: ScheduleFormatted) {
		const { id: scheduleId, patientId, specialistId, rangeStart } = schedule

		const specialist = await this.specialistService.findById(specialistId)
		const specialistSocket = this.patients.find(patient => patient.id === patientId)

		if (!specialistSocket) {
			// TODO: send email
			return
		}

		this.server.to(specialistSocket.socketId).emit(WsEvents.SEND_NOTIFICATION, {
			scheduleId,
			id: faker.datatype.uuid(),
			type: 'appointment_new',
			avatar: specialist?.avatarUrl,
			name: specialist?.name,
			when: rangeStart,
			createdAt: new Date()
		} as Notification)
	}
}
