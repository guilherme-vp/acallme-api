import { ScheduleRepository } from '@modules/schedules/repositories'
import { BadRequestException, Injectable } from '@nestjs/common'
import { I18nService } from 'nestjs-i18n'

@Injectable()
export class ConfirmUseCase {
	constructor(
		private readonly scheduleRepository: ScheduleRepository,
		private readonly languageService: I18nService
	) {}

	async execute(specialistId: number, scheduledId: number) {
		const foundSchedule = await this.scheduleRepository.getOne({
			CD_ESPECIALISTA: specialistId,
			CD_AGENDA: scheduledId
		})

		if (!foundSchedule) {
			throw new BadRequestException(
				await this.languageService.translate('schedule.user-not-authorized')
			)
		}

		if (foundSchedule.confirmed) {
			throw new BadRequestException(
				await this.languageService.translate('schedule.already-confimed')
			)
		}

		await this.scheduleRepository.confirmSchedule(scheduledId)

		return true
	}
}
