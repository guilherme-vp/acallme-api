import { NotificationGateway } from '@common/gateways/notification.gateway'
import { VideoCallGateway } from '@modules/calls/websockets'
import { PatientService } from '@modules/patients/patients.service'
import { SpecialistService } from '@modules/specialists/specialists.service'
import { Injectable } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { MailerService } from '@services/mail'
import { PrismaService } from '@services/prisma'
import {
	startOfToday,
	endOfToday,
	startOfHour,
	subHours,
	differenceInSeconds,
	format,
	addHours
} from 'date-fns'

import { SchedulesService } from '../schedules.service'

export const BetweenDates = (startDate: Date, endDate: Date) => ({
	startsAt: {
		gte: startDate,
		lte: endDate
	},
	endsAt: {
		gte: startDate,
		lte: endDate
	}
})

@Injectable()
export class TaskService {
	constructor(
		private readonly scheduleService: SchedulesService,
		private readonly specialistService: SpecialistService,
		private readonly patientService: PatientService,
		private readonly mailerService: MailerService,
		private readonly videoCallGateway: VideoCallGateway,
		private readonly notificationGateway: NotificationGateway,
		private readonly prisma: PrismaService
	) {}

	@Cron(CronExpression.EVERY_5_MINUTES, { name: 'db-refresh' })
	async dbRefresh() {
		await this.specialistService.findOne({ name: 'refreshed' })
	}

	@Cron('0 5 * * *', { name: 'daily-calls' })
	async sendDailyCalls() {
		const todayStart = startOfToday()
		const todayEnd = endOfToday()

		const dailySchedules = await this.prisma.schedule.findMany({
			where: BetweenDates(todayStart, todayEnd)
		})

		await Promise.all(
			dailySchedules.map(async ({ patientId, specialistId, confirmed, startsAt }) => {
				if (!confirmed || !patientId) {
					return
				}

				const specialist = await this.specialistService.findById(specialistId)
				const patient = await this.patientService.findById(patientId)

				if (!specialist || !patient) {
					return
				}

				const formattedDate = format(startsAt, 'haaa')

				await this.mailerService.send({
					to: {
						address: specialist.email,
						name: specialist.name
					},
					subject: 'Yours calls today',
					html: `<h2>Hello ${specialist.name}! You have an call at ${formattedDate} with ${patient.name}!</h2>`
				})
			})
		)

		// TODO: Create daily email and send it with mailer service
	}

	@Cron('0 6-20/1 * * *', { name: 'send-warn-call-notification' })
	async sendWarnCallNotification() {
		const twoHoursAfterNow = addHours(new Date(), 2)

		const schedules = await this.prisma.schedule.findMany({
			where: {
				confirmed: true,
				startsAt: twoHoursAfterNow
			}
		})

		await Promise.all(
			schedules.map(async schedule => {
				const { patientId, specialistId, confirmed } = schedule

				if (!confirmed || !patientId) {
					return
				}

				const specialist = await this.specialistService.findById(specialistId)
				const patient = await this.patientService.findById(patientId)

				if (!specialist || !patient) {
					return
				}

				this.notificationGateway.sendCallNotifications(schedule)

				await this.mailerService.send({
					to: {
						address: patient.email,
						name: patient.name
					},
					subject: 'Your calls today',
					html: `<h2>Hello ${patient.name}!You have an call in 2 hours</h2>`
				})

				await this.mailerService.send({
					to: {
						address: specialist.email,
						name: specialist.name
					},
					subject: 'Your calls today',
					html: `<h2>Hello ${specialist.name}! You have an call in 2 hours</h2>`
				})
			})
		)
	}

	@Cron('0 6-20/1 * * *', { name: 'send-call-notification' })
	async sendCallNotification() {
		const hourStart = startOfHour(new Date())

		const schedules = await this.scheduleService.getMany({
			confirmed: String(true),
			startsAt: hourStart.toISOString()
		})

		await Promise.all(
			schedules.map(async schedule => {
				const { patientId, specialistId, confirmed } = schedule

				if (!confirmed || !patientId) {
					return
				}

				const specialist = await this.specialistService.findById(specialistId)
				const patient = await this.patientService.findById(patientId)

				if (!specialist || !patient) {
					return
				}

				this.notificationGateway.sendCallNotifications(schedule)

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

	@Cron('0 6-20/1 * * *', { name: 'warn-close-call-notification' })
	async warnCloseCall() {
		const hourBefore = subHours(new Date(), 1)
		const startOfHourBefore = startOfHour(hourBefore)

		const schedules = await this.scheduleService.getMany({
			startsAt: startOfHourBefore.toISOString(),
			confirmed: String(true)
		})

		await Promise.all(
			schedules.map(async schedule => {
				const { id, patientId, specialistId, confirmed } = schedule

				if (!confirmed || !patientId) {
					return
				}

				const specialist = await this.specialistService.findById(specialistId)
				const patient = await this.patientService.findById(patientId)

				if (!specialist || !patient) {
					return
				}

				this.videoCallGateway.sendCallCloseNotification(`room-${id}`)
			})
		)
	}

	@Cron('5 6-20/1 * * *', { name: 'close-call' })
	async closeCall() {
		const hourBefore = subHours(new Date(), 1)
		const startOfHourBefore = startOfHour(hourBefore)
		const duration = differenceInSeconds(startOfHourBefore, Date.now())

		const schedules = await this.scheduleService.getMany({
			startsAt: startOfHourBefore.toISOString(),
			confirmed: String(true)
		})

		await Promise.all(
			schedules.map(async schedule => {
				const { id } = schedule

				await this.videoCallGateway.endCall({
					scheduleId: id,
					duration
				})
			})
		)
	}
}
