import { ScheduleFormatted } from '@modules/schedules/entities'
import { PatientScheduleRepository } from '@modules/schedules/repositories'
import { formatSchedule } from '@modules/schedules/utils'
import { Injectable, NotFoundException } from '@nestjs/common'
import { I18nService } from 'nestjs-i18n'

@Injectable()
export class FindPatientUseCase {
	constructor(
		private readonly patientSchedRepository: PatientScheduleRepository,
		private readonly languageService: I18nService
	) {}

	async execute(patientId: number): Promise<ScheduleFormatted> {
		const foundSchedule = await this.patientSchedRepository.getByPatientId(patientId)

		if (!foundSchedule) {
			throw new NotFoundException(
				await this.languageService.translate('patient.patient-not-found')
			)
		}

		const formattedSchedule = formatSchedule(foundSchedule)

		return formattedSchedule
	}
}
