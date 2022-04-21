import { NotificationGateway } from '@common/gateways'
import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import { PrismaService } from '@services/prisma'
import { startOfHour } from 'date-fns'
import { I18nService } from 'nestjs-i18n'

import { DisableDto } from '../../dtos'

@Injectable()
export class DisableUseCase {
	private logger: Logger = new Logger('DisableSchedule')

	constructor(
		private readonly notificationGateway: NotificationGateway,
		private readonly languageService: I18nService,
		private readonly prisma: PrismaService
	) {}

	async execute(data: DisableDto, specialistId: number): Promise<boolean> {
		const { dateEnd, dateStart } = data
		const startsAt = startOfHour(new Date(dateStart))
		const endsAt = startOfHour(new Date(dateEnd))

		this.logger.log('Searching for existing schedule')
		const scheduleExist = await this.prisma.schedule.findFirst({
			where: {
				specialistId,
				startsAt
			}
		})

		if (scheduleExist && scheduleExist.confirmed) {
			this.logger.log('Schedule is already confirmed')
			throw new BadRequestException(
				await this.languageService.translate('schedule.cant-disable-confirmed')
			)
		}

		await this.prisma.schedule.upsert({
			create: {
				startsAt,
				endsAt,
				specialistId
			},
			update: {
				disabled: true,
				confirmed: false
			},
			where: {
				id: scheduleExist?.id
			}
		})

		if (scheduleExist) {
			this.logger.log('Send appointment notification to patient and specialist')
			this.notificationGateway.sendAppointmentConfirmation({
				...scheduleExist,
				disabled: true,
				confirmed: false
			})
		}

		return true
	}
}
