import { Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { MailerService } from '@services/mail'
import * as datefns from 'date-fns'

import { AppointmentRepository } from '../repositories'
import { formatAppointment } from '../utils'
import { VideoCallGateway } from '../websockets'

@Injectable()
export class TaskService {
	constructor(
		private readonly appointmentRepository: AppointmentRepository,
		private readonly mailerService: MailerService,
		private readonly videoCallGateway: VideoCallGateway
	) {}

	@Cron('0 5 * * *', { name: 'daily-appointments' })
	async sendDailyAppointments() {
		const todayStart = datefns.startOfToday()
		const todayEnd = datefns.endOfToday()

		const dailyAppointments = await this.appointmentRepository.getManyTodayWithUsers({
			startDate: todayStart,
			endDate: todayEnd
		})

		await Promise.all(
			dailyAppointments.map(async appointment => {
				const formattedAppointment = formatAppointment(appointment)

				const { specialist } = formattedAppointment

				await this.mailerService.send({
					to: {
						address: specialist.email,
						name: specialist.name
					},
					subject: 'Yours appointments today',
					html: `<h2>Hello ${specialist.name}! You have an appointment at ${formattedAppointment.scheduled}</h2>`
				})
			})
		)

		// TODO: Create daily email and send it with mailer service
	}

	@Cron('0 5-23/1 * * *', { name: 'send-warn-appointment-notification' })
	async sendWarnAppointmentNotification() {
		const twoHoursAfterNow = datefns.addHours(new Date(), 2)

		const appointments = await this.appointmentRepository.getMany({
			VL_CONFIRMADO: 1,
			DT_CONSULTA: twoHoursAfterNow
		})

		await Promise.all(
			appointments.map(async appointment => {
				const formattedAppointment = formatAppointment(appointment)

				const { patient, specialist } = formattedAppointment

				this.videoCallGateway.sendAppointmentNotifications(formattedAppointment)

				await this.mailerService.send({
					to: {
						address: patient.email,
						name: patient.name
					},
					subject: 'Yours appointments today',
					html: `<h2>Hello ${patient.name}!You have an appointment in 2 hours</h2>`
				})

				await this.mailerService.send({
					to: {
						address: specialist.email,
						name: specialist.name
					},
					subject: 'Yours appointments today',
					html: `<h2>Hello ${specialist.name}! You have an appointment in 2 hours</h2>`
				})
			})
		)
	}

	@Cron('0 5-21/1 * * *', { name: 'send-appointment-notification' })
	async sendAppointmentNotification() {
		const hourStart = datefns.startOfHour(new Date())

		const appointments = await this.appointmentRepository.getMany({
			VL_CONFIRMADO: 1,
			DT_CONSULTA: hourStart
		})

		await Promise.all(
			appointments.map(async appointment => {
				const { id: appointmentId, patient, specialist } = formatAppointment(appointment)

				this.videoCallGateway.sendUsersCall({
					appointmentId,
					patientId: patient.id as number,
					specialistId: specialist.id as number
				})

				await this.mailerService.send({
					to: { address: patient.email, name: patient.name },
					subject: `${patient.name}, sua consulta está acontecendo agora`,
					html: `Hey ${patient.name}! Sua consulta está acontecendo agora!!`
				})

				await this.mailerService.send({
					to: { address: specialist.email, name: specialist.name },
					subject: `${specialist.name}, sua consulta está acontecendo agora`,
					html: `Hey ${specialist.name}! Sua consulta está acontecendo agora!!`
				})
			})
		)
	}

	@Cron('0 5-23/1 * * *', { name: 'warn-close-appointment-notification' })
	async warnCloseAppointment() {
		const hourBefore = datefns.subHours(new Date(), 1)
		const startOfHourBefore = datefns.startOfHour(hourBefore)

		const appointments = await this.appointmentRepository.getMany({
			VL_CONFIRMADO: 1,
			DT_CONSULTA: startOfHourBefore
		})

		await Promise.all(
			appointments.map(async appointment => {
				const { id: appointmentId, patient, specialist } = formatAppointment(appointment)

				this.videoCallGateway.sendUsersCall({
					appointmentId,
					patientId: patient.id as number,
					specialistId: specialist.id as number
				})

				await this.mailerService.send({
					to: { address: patient.email, name: patient.name },
					subject: `${patient.name}, sua consulta está acontecendo agora`,
					html: `Hey ${patient.name}! Sua consulta está acontecendo agora!!`
				})

				await this.mailerService.send({
					to: { address: specialist.email, name: specialist.name },
					subject: `${specialist.name}, sua consulta está acontecendo agora`,
					html: `Hey ${specialist.name}! Sua consulta está acontecendo agora!!`
				})
			})
		)
	}

	@Cron('5 5-23/1 * * *', { name: 'close-appointment' })
	async closeAppointment() {
		const hourBefore = datefns.subHours(new Date(), 1)
		const startOfHourBefore = datefns.startOfHour(hourBefore)

		const appointments = await this.appointmentRepository.getMany({
			VL_CONFIRMADO: 1,
			DT_CONSULTA: startOfHourBefore
		})

		appointments.map(appointment => {
			const { patient, specialist } = formatAppointment(appointment)

			this.videoCallGateway.endCall({
				patientId: patient.id as number,
				specialistId: specialist.id as number
			})
		})
	}
}
