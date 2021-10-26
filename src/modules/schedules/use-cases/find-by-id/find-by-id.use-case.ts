import { Schedule } from '@modules/schedules/entities'
import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { I18nService } from 'nestjs-i18n'
import { Repository } from 'typeorm'

@Injectable()
export class FindByIdUseCase {
	private logger: Logger = new Logger('FindScheduleById')

	constructor(
		private readonly languageService: I18nService,
		@InjectRepository(Schedule) private readonly scheduleRepository: Repository<Schedule>
	) {}

	async execute(id: number, select?: (keyof Schedule)[]): Promise<Schedule | null> {
		this.logger.log('Searching for schedule with given id')
		const foundSchedule = await this.scheduleRepository.findOne({ where: { id }, select })

		if (!foundSchedule) {
			this.logger.log('Throwing because no schedule was found')
			throw new NotFoundException(
				await this.languageService.translate('schedule.dont-exist')
			)
		}

		this.logger.log('Returning found schedule')
		return foundSchedule
	}
}
