import { Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { MailerService } from '@services/mail'
import * as datefns from 'date-fns'

import { AppointmentRepository } from '../repositories'

@Injectable()
export class TaskService {
	constructor(
		private readonly appointmentRepository: AppointmentRepository,
		private readonly mailerService: MailerService
	) {}

	@Cron('0 5 * * *', { name: 'daily-appointments' })
	async sendDailyAppointments() {
		const todayStart = datefns.startOfToday()
		const todayEnd = datefns.endOfToday()

		const dailyAppointments = await this.appointmentRepository.getManyTodayWithUsers({
			startDate: todayStart,
			endDate: todayEnd
		})

		// TODO: Create daily email and send it with mailer service
	}

	@Cron('0 5-23/1 * * *', { name: 'send-warn-appointment-notification' })
	async sendWarnAppointmentNotification() {
		const twoHoursAfterNow = datefns.addHours(new Date(), 2)

		const appointments = await this.appointmentRepository.getMany({
			VL_CONFIRMADO: 1,
			DT_CONSULTA: twoHoursAfterNow
		})

		// Send notification to patient and specialist warning about the scheduled appointment 2 hours before
		// TODO: send email and notification via websocket
	}

	@Cron('0 5-23/1 * * *', { name: 'send-appointment-notification' })
	async sendAppointmentNotification() {
		const hourStart = datefns.startOfHour(new Date())

		const appointments = await this.appointmentRepository.getMany({
			VL_CONFIRMADO: 1,
			DT_CONSULTA: hourStart
		})

		// Send notification to patient and specialist warning about the running appointment
		// TODO: Create websocket room, send links to email and notification
	}

	@Cron('0 5-23/1 * * *', { name: 'warn-close-appointment-notification' })
	async warnCloseAppointment() {
		const hourBefore = datefns.subHours(new Date(), 1)
		const startOfHourBefore = datefns.startOfHour(hourBefore)

		const appointments = await this.appointmentRepository.getMany({
			VL_CONFIRMADO: 1,
			DT_CONSULTA: startOfHourBefore
		})

		// TODO: Emit notification to websocket
	}

	@Cron('5 5-23/1 * * *', { name: 'close-appointment' })
	async closeAppointment() {
		const hourBefore = datefns.subHours(new Date(), 1)
		const startOfHourBefore = datefns.startOfHour(hourBefore)

		const appointments = await this.appointmentRepository.getMany({
			VL_CONFIRMADO: 1,
			DT_CONSULTA: startOfHourBefore
		})

		// TODO: Emit notification to websocket closing the room
	}
}
