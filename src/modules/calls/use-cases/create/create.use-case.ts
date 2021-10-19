import { CallRepository } from '@modules/calls/repositories'
import { SchedulesService } from '@modules/schedules/schedules.service'
import { BadRequestException, Injectable } from '@nestjs/common'
import { I18nService } from 'nestjs-i18n'

import { CreateDto } from '../../dtos'

@Injectable()
export class CreateUseCase {
	constructor(
		private readonly callRepository: CallRepository,
		private readonly scheduleService: SchedulesService,
		private readonly languageService: I18nService
	) {}

	async execute(input: CreateDto) {
		const { scheduleId, duration, rating } = input

		const foundSchedule = await this.scheduleService.getById(scheduleId)

		if (!foundSchedule) {
			throw new BadRequestException(
				await this.languageService.translate('schedule.dont-exist')
			)
		}

		const createdCall = await this.callRepository.create({
			CD_AGENDA: scheduleId,
			VL_AVALIACAO: rating,
			VL_DURACAO: duration
		})

		return createdCall
	}
}
