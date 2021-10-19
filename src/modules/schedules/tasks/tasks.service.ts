import { formatCall } from '@modules/calls/utils'
import { PatientRepository } from '@modules/patients/repositories'
import { ScheduleRepository } from '@modules/schedules/repositories'
import { SpecialistRepository } from '@modules/specialists/repositories'
import { Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { MailerService } from '@services/mail'
import * as datefns from 'date-fns'

import { VideoCallGateway } from '../websockets'

@Injectable()
export class TaskService {
	constructor(
		private readonly specialistRepository: SpecialistRepository,
		private readonly patientRepository: PatientRepository,
		private readonly scheduleRepository: ScheduleRepository,
		private readonly mailerService: MailerService,
		private readonly videoCallGateway: VideoCallGateway
	) {}

	@Cron('0 5 * * *', { name: 'daily-calls' })
	async sendDailyCalls() {
		const todayStart = datefns.startOfToday()
		const todayEnd = datefns.endOfToday()

		const dailySchedules = await this.scheduleRepository.getManyToday({
			startDate: todayStart,
			endDate: todayEnd
		})

		await Promise.all(
			dailySchedules.map(async ({ patientId, specialistId, confirmed, rangeStart }) => {
				if (!confirmed || !patientId) {
					return
				}

				const specialist = await this.specialistRepository.getOneById(specialistId)
				const patient = await this.patientRepository.getOneById(patientId)

				const formattedDate = datefns.format(rangeStart, 'haaa')

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
		const twoHoursAfterNow = datefns.addHours(new Date(), 2)

		const schedules = await this.scheduleRepository.getMany({
			VL_CONFIRMADO: 1,
			DT_INI_RANGE: twoHoursAfterNow
		})

		await Promise.all(
			schedules.map(async schedule => {
				const { patientId, specialistId, confirmed } = schedule

				if (!confirmed || !patientId) {
					return
				}

				const specialist = await this.specialistRepository.getOneById(specialistId)
				const patient = await this.patientRepository.getOneById(patientId)

				this.videoCallGateway.sendCallNotifications(schedule)

				await this.mailerService.send({
					to: {
						address: patient.email,
						name: patient.name
					},
					subject: 'Yours calls today',
					html: `<h2>Hello ${patient.name}!You have an call in 2 hours</h2>`
				})

				await this.mailerService.send({
					to: {
						address: specialist.email,
						name: specialist.name
					},
					subject: 'Yours calls today',
					html: `<h2>Hello ${specialist.name}! You have an call in 2 hours</h2>`
				})
			})
		)
	}

	@Cron('0 6-20/1 * * *', { name: 'send-call-notification' })
	async sendCallNotification() {
		const hourStart = datefns.startOfHour(new Date())

		const schedules = await this.scheduleRepository.getMany({
			VL_CONFIRMADO: 1,
			DT_INI_RANGE: hourStart
		})

		await Promise.all(
			schedules.map(async schedule => {
				const { id, patientId, specialistId, confirmed } = schedule

				if (!confirmed || !patientId) {
					return
				}

				const specialist = await this.specialistRepository.getOneById(specialistId)
				const patient = await this.patientRepository.getOneById(patientId)

				this.videoCallGateway.sendUsersCall({
					scheduleId: id,
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

	@Cron('0 6-20/1 * * *', { name: 'warn-close-call-notification' })
	async warnCloseCall() {
		const hourBefore = datefns.subHours(new Date(), 1)
		const startOfHourBefore = datefns.startOfHour(hourBefore)

		const schedules = await this.scheduleRepository.getMany({
			DT_INI_RANGE: startOfHourBefore,
			VL_CONFIRMADO: 1
		})

		await Promise.all(
			schedules.map(async schedule => {
				const { id, patientId, specialistId, confirmed } = schedule

				if (!confirmed || !patientId) {
					return
				}

				const specialist = await this.specialistRepository.getOneById(specialistId)
				const patient = await this.patientRepository.getOneById(patientId)

				this.videoCallGateway.sendUsersCall({
					scheduleId: id,
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

	@Cron('5 6-20/1 * * *', { name: 'close-call' })
	async closeCall() {
		const hourBefore = datefns.subHours(new Date(), 1)
		const startOfHourBefore = datefns.startOfHour(hourBefore)
		const duration = datefns.differenceInSeconds(startOfHourBefore, Date.now())

		const schedules = await this.scheduleRepository.getMany({
			VL_CONFIRMADO: 1,
			DT_INI_RANGE: startOfHourBefore
		})

		await Promise.all(
			schedules.map(async schedule => {
				const { id, specialistId, patientId } = schedule

				this.videoCallGateway.endCall({
					scheduleId: id,
					patientId,
					specialistId,
					duration
				})
			})
		)
	}
}
