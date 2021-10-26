/* eslint-disable indent */
import { WsEvents } from '@common/domain/enums'
import { PatientWs } from '@modules/patients/decorators'
import { Patient } from '@modules/patients/entities'
import { Schedule } from '@modules/schedules/entities'
import { SpecialistWs } from '@modules/specialists/decorators'
import { Specialist } from '@modules/specialists/entities'
import { SpecialistService } from '@modules/specialists/specialists.service'
import { Logger, UseFilters } from '@nestjs/common'
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

import { NotificationModel } from '../domain/models'

@UseFilters(new BaseWsExceptionFilter())
@WebSocketGateway({ cors: true })
export class NotificationGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	constructor(private readonly specialistService: SpecialistService) {}

	@WebSocketServer() server!: Server
	private logger: Logger = new Logger('NotificationGateway')

	public patients: (Patient & { socketId: string })[] = []
	public specialists: (Specialist & { socketId: string })[] = []

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

	@SubscribeMessage(WsEvents.ME)
	// @UseGuards(WsAuthGuard)
	me(
		@ConnectedSocket() client: Socket,
		@PatientWs() patient: Patient,
		@SpecialistWs() specialist: Specialist
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

	sendCallNotifications(schedule: Schedule) {
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
			} as NotificationModel)
		}

		if (specialistSocket) {
			this.server.to(specialistSocket.socketId).emit(WsEvents.SEND_NOTIFICATION, {
				id: faker.datatype.uuid(),
				createdAt: new Date(),
				type: 'appointment_call',
				scheduleId: id
			} as NotificationModel)
		}
	}

	sendAppointmentConfirmation(schedule: Schedule) {
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
			isConfirmed: Boolean(confirmed),
			when: rangeStart
		} as NotificationModel)
	}

	async sendNewAppointment(schedule: Schedule) {
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
		} as NotificationModel)
	}
}
