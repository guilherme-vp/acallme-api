import { AppointmentRepository } from '@modules/appointments/repositories'
import { SchedulesService } from '@modules/schedules/schedules.service'
import { BadRequestException, Injectable } from '@nestjs/common'
import { I18nService } from 'nestjs-i18n'

import { CreateDto } from '../../dtos'

@Injectable()
export class CreateUseCase {
	constructor(
		private readonly appointmentRepository: AppointmentRepository,
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

		const createdAppointment = await this.appointmentRepository.create({
			CD_AGENDA: scheduleId,
			VL_AVALIACAO: rating,
			VL_DURACAO: duration
		})

		return createdAppointment
	}
}
