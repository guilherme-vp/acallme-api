import { ScheduleFormatted } from '@modules/schedules/entities'
import { SpecialistScheduleRepository } from '@modules/schedules/repositories'
import { formatSchedule } from '@modules/schedules/utils'
import { Injectable, NotFoundException } from '@nestjs/common'
import { I18nService } from 'nestjs-i18n'

@Injectable()
export class FindSpecialistUseCase {
	constructor(
		private readonly specialistSchedRepository: SpecialistScheduleRepository,
		private readonly languageService: I18nService
	) {}

	async execute(specialistId: number): Promise<ScheduleFormatted> {
		const foundSchedule = await this.specialistSchedRepository.getBySpecialistId(
			specialistId
		)

		if (!foundSchedule) {
			throw new NotFoundException(
				await this.languageService.translate('specialist.specialist-not-found')
			)
		}

		const formattedSchedule = formatSchedule(foundSchedule)

		return formattedSchedule
	}
}
