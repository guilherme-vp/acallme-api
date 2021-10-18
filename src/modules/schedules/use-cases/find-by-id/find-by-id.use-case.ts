import { ScheduleFormatted } from '@modules/schedules/entities'
import { ScheduleRepository } from '@modules/schedules/repositories'
import { Injectable, NotFoundException } from '@nestjs/common'
import { I18nService } from 'nestjs-i18n'

@Injectable()
export class FindByIdUseCase {
	constructor(
		private readonly scheduleRepository: ScheduleRepository,
		private readonly languageService: I18nService
	) {}

	async execute(scheduleId: number): Promise<ScheduleFormatted> {
		const foundSchedule = await this.scheduleRepository.getById(scheduleId)

		if (!foundSchedule) {
			throw new NotFoundException(
				await this.languageService.translate('schedule.dont-exist')
			)
		}

		return foundSchedule
	}
}
