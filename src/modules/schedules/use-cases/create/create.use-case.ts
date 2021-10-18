import { PatientRepository } from '@modules/patients/repositories'
import { CreateDto } from '@modules/schedules/dtos'
import { ScheduleFormatted } from '@modules/schedules/entities'
import { ScheduleRepository } from '@modules/schedules/repositories'
import { BadRequestException, Injectable } from '@nestjs/common'
import { differenceInDays } from 'date-fns'
import { I18nService } from 'nestjs-i18n'

@Injectable()
export class CreateUseCase {
	constructor(
		private readonly scheduleRepository: ScheduleRepository,
		private readonly patientRepository: PatientRepository,
		private readonly languageService: I18nService
	) {}

	async execute(specialistId: number, data: CreateDto): Promise<ScheduleFormatted> {
		const { dateEnd, dateStart } = data
		const rangeStart = new Date(dateStart)
		const rangeEnd = new Date(dateEnd)

		if (data.patientId) {
			const patient = await this.patientRepository.getOneById(data.patientId)

			if (!patient) {
				throw new BadRequestException(
					this.languageService.translate('patient.patient-not-found')
				)
			}
		}

		const now = new Date()

		if (differenceInDays(new Date(dateStart), now) < 1) {
			throw new BadRequestException(
				this.languageService.translate('schedule.date-not-valid')
			)
		}

		const scheduleExist = await this.scheduleRepository.existsAtTheSameTime(
			rangeStart,
			specialistId
		)

		if (scheduleExist) {
			throw new BadRequestException(
				this.languageService.translate('schedule.date-not-valid')
			)
		}

		const createdSchedule = await this.scheduleRepository.create({
			CD_ESPECIALISTA: specialistId,
			DT_INI_RANGE: rangeStart,
			DT_FIM_RANGE: rangeEnd,
			VL_CONFIRMADO: 0
		})

		return createdSchedule
	}
}
