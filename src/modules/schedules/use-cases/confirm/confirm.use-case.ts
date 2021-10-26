import { NotificationGateway } from '@common/gateways'
import { Schedule } from '@modules/schedules/entities'
import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { I18nService } from 'nestjs-i18n'
import { Repository } from 'typeorm'

@Injectable()
export class ConfirmUseCase {
	private logger: Logger = new Logger('ScheduleConfirm')

	constructor(
		private readonly languageService: I18nService,
		private readonly notificationGateway: NotificationGateway,
		@InjectRepository(Schedule) private readonly scheduleRepository: Repository<Schedule>
	) {}

	async execute(scheduleId: number, specialistId: number, confirmed: number) {
		this.logger.log('Find schedule with given schedule and specialist id')
		const foundSchedule = await this.scheduleRepository.findOne({
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
		await this.scheduleRepository.save({ id: scheduleId, confirmed })

		this.notificationGateway.sendAppointmentConfirmation({ ...foundSchedule, confirmed })

		return true
	}
}
