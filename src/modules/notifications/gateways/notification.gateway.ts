import { WsAuthGuard } from '@common/guards/ws-auth.guard'
import { PatientWs } from '@modules/patients/decorators'
import { Patient } from '@modules/patients/entities'
import { PatientService } from '@modules/patients/patients.service'
import { Schedule } from '@modules/schedules/entities'
import { SpecialistWs } from '@modules/specialists/decorators'
import { Specialist } from '@modules/specialists/entities'
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
import { Server, Socket } from 'socket.io'
import { v4 as uuidv4 } from 'uuid'

import { NotificationModel } from '../entities'
import { NotificationsEnum, NotificationsWsEvents } from '../entities/enums'

@UseFilters(new BaseWsExceptionFilter())
@WebSocketGateway({ namespace: 'notification', cors: true })
export class NotificationGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	constructor(
		private readonly specialistService: SpecialistService,
		private readonly patientService: PatientService
	) {}

	@WebSocketServer() server!: Server
	private logger: Logger = new Logger('NotificationGateway')

	public patients: (Patient & { socketId: string })[] = []
	public specialists: (Specialist & { socketId: string })[] = []

	public afterInit(): void {
		return this.logger.warn(`Websocket namespace running in: /notification`)
	}

	public handleDisconnect(client: Socket): void {
		this.patients = this.patients.filter(({ socketId }) => socketId !== client.id)
		this.specialists = this.specialists.filter(({ socketId }) => socketId !== client.id)

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

	@SubscribeMessage(NotificationsWsEvents.IDENTIFY)
	@UseGuards(WsAuthGuard)
	identify(
		@ConnectedSocket() client: Socket,
		@PatientWs() patient: Patient,
		@SpecialistWs() specialist: Specialist
	) {
		this.logger.log(
			{ patient, specialist },
			`Client ${client.id} identified as ${patient ? 'patient' : 'specialist'}`
		)

		if (patient) {
			const newPatient = { ...patient, socketId: client.id }
			this.patients.push(newPatient)
		}

		if (specialist) {
			const newSpecialist = { ...specialist, socketId: client.id }
			this.specialists.push(newSpecialist)
		}

		this.logger.log(
			{ patients: this.patients, specialists: this.specialists },
			'Current Users'
		)
	}

	sendCallNotifications(schedule: Schedule) {
		const { id, specialistId, patientId } = schedule

		if (!specialistId || !patientId) {
			this.logger.log(schedule, 'Missing specialist or patient id for schedule')
			return
		}

		const { patientSocket, specialistSocket } = this.getSockets(patientId, specialistId)
		if (patientSocket) {
			this.server.to(patientSocket.socketId).emit(NotificationsWsEvents.SEND_NOTIFICATION, {
				id: uuidv4(),
				createdAt: new Date(),
				type: NotificationsEnum.APPOINTMENT_CALL,
				scheduleId: id
			} as NotificationModel)
		}

		if (specialistSocket) {
			this.server
				.to(specialistSocket.socketId)
				.emit(NotificationsWsEvents.SEND_NOTIFICATION, {
					id: uuidv4(),
					createdAt: new Date(),
					type: NotificationsEnum.APPOINTMENT_CALL,
					scheduleId: id
				} as NotificationModel)
		}
	}

	async sendAppointmentConfirmation(schedule: Schedule) {
		const { id, patientId, startsAt, confirmed } = schedule

		if (patientId == null) {
			this.logger.error(schedule, 'Missing patient id for schedule')
			return
		}

		const foundPatient = await this.patientService.findById(patientId)
		if (!foundPatient) {
			this.logger.log(`Patient ${patientId} does not exists`)
			return
		}

		const patientSocket = this.patients.find(patient => patient.id === patientId)
		if (!patientSocket) {
			this.logger.log(`Patient ${patientId} is not logged, sending confirmation email`)
			// TODO: send email
			return
		}

		this.logger.log('Sending confirmation to patient', patientSocket.socketId)
		this.server.to(patientSocket.socketId).emit(NotificationsWsEvents.SEND_NOTIFICATION, {
			id: uuidv4(),
			scheduleId: id,
			type: NotificationsEnum.APPOINTMENT_CONFIRMATION,
			isConfirmed: Boolean(confirmed),
			when: startsAt,
			name: foundPatient.name,
			avatar: foundPatient.avatarUrl,
			createdAt: new Date()
		} as NotificationModel)
	}

	async sendNewAppointment(schedule: Schedule) {
		const { id: scheduleId, specialistId, startsAt } = schedule

		const foundSpecialist = await this.specialistService.findById(specialistId)
		if (!foundSpecialist) {
			this.logger.log(`Specialist ${specialistId} does not exists`)
			return
		}

		const specialistSocket = this.specialists.find(
			specialist => specialist.id === specialistId
		)
		if (!specialistSocket) {
			this.logger.log(
				`Specialist ${specialistId} is not logged, sending new appointment email`
			)
			// TODO: send email
			return
		}

		this.logger.log('Emiting to specialist socket', specialistSocket.socketId)
		this.server
			.to(specialistSocket.socketId)
			.emit(NotificationsWsEvents.SEND_NOTIFICATION, {
				scheduleId,
				id: uuidv4(),
				type: NotificationsEnum.APPOINTMENT_NEW,
				avatar: foundSpecialist.avatarUrl,
				name: foundSpecialist.name,
				when: startsAt,
				createdAt: new Date()
			} as NotificationModel)
	}
}
