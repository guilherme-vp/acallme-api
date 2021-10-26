import { NotificationGateway } from '@common/gateways'
import { Schedule } from '@modules/schedules/entities'
import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { startOfHour } from 'date-fns'
import { I18nService } from 'nestjs-i18n'
import { Repository } from 'typeorm'

import { DisableDto } from '../../dtos'

@Injectable()
export class DisableUseCase {
	private logger: Logger = new Logger('DisableSchedule')

	constructor(
		private readonly notificationGateway: NotificationGateway,
		private readonly languageService: I18nService,
		@InjectRepository(Schedule) private readonly scheduleRepository: Repository<Schedule>
	) {}

	async execute(data: DisableDto, specialistId: number): Promise<boolean> {
		const { dateEnd, dateStart } = data
		const rangeStart = startOfHour(new Date(dateStart))
		const rangeEnd = startOfHour(new Date(dateEnd))

		this.logger.log('Searching for existing schedule')
		const scheduleExist = await this.scheduleRepository.findOne({
			specialistId,
			rangeStart
		})

		if (scheduleExist && scheduleExist.confirmed) {
			this.logger.log('Schedule is already confirmed')
			throw new BadRequestException(
				await this.languageService.translate('schedule.cant-disable-confirmed')
			)
		}

		if (!scheduleExist) {
			this.logger.log('Creating schedule if it does not exist')
			await this.scheduleRepository.save({
				specialistId,
				rangeStart,
				rangeEnd,
				disabled: 1
			})
		} else {
			this.logger.log('Updating found schedule')
			const updatedSchedule = await this.scheduleRepository.update(
				{ disabled: 1, confirmed: 0 },
				{
					id: scheduleExist.id
				}
			)

			if (!updatedSchedule) {
				return false
			}

			this.logger.log('Send appointment notification to patient and specialist')
			this.notificationGateway.sendAppointmentConfirmation({
				...scheduleExist,
				disabled: 1,
				confirmed: 0
			})
		}

		return true
	}
}
