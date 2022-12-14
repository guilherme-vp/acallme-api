import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import { I18nService } from 'nestjs-i18n'

import { NotificationGateway } from '@modules/notifications/gateways'

import { PrismaService } from '@services/prisma'

@Injectable()
export class ConfirmUseCase {
	private logger: Logger = new Logger('ScheduleConfirm')

	constructor(
		private readonly languageService: I18nService,
		private readonly notificationGateway: NotificationGateway,
		private readonly prisma: PrismaService
	) {}

	async execute(scheduleId: number, specialistId: number, confirmed: boolean) {
		this.logger.log('Find schedule with given schedule and specialist id')
		const foundSchedule = await this.prisma.schedule.findFirst({
			where: {
				id: scheduleId,
				specialistId
			}
		})

		if (!foundSchedule) {
			this.logger.error('Throwing because no schedule was found')
			throw new BadRequestException(
				await this.languageService.translate('schedule.user-not-authorized')
			)
		}

		if (foundSchedule.confirmed) {
			this.logger.error('Throwing because schedule is already confirmed')
			throw new BadRequestException(
				await this.languageService.translate('schedule.already-confimed')
			)
		}

		this.logger.log('Confirming schedule')
		await this.prisma.schedule.update({ where: { id: scheduleId }, data: { confirmed } })

		this.notificationGateway.sendAppointmentConfirmation({ ...foundSchedule, confirmed })

		return true
	}
}
