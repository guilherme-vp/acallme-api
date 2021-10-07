import { Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import * as datefns from 'date-fns'

import { AppointmentRepository } from '../repositories'

@Injectable()
export class TaskService {
	constructor(private readonly appointmentRepository: AppointmentRepository) {}

	@Cron('0 5 * * *', { name: 'daily-appointments' })
	async sendDailyAppointments() {
		const today = datefns.startOfToday()

		const dailyAppointments = await this.appointmentRepository.getManyTodayWithUsers(today)
	}

	@Cron('0 1/ * * *', { name: 'send-appointment-notification' })
	async sendAppointmentNotification() {
		const appointments = await this.appointmentRepository.getMany(
			{ VL_CONFIRMADO: 1 },
			true
		)
	}
}
