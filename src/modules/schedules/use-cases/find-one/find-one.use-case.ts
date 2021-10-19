import { RequireAtLeastOne } from '@core/types'
import { FindOneDto } from '@modules/schedules/dtos'
import { ScheduleFormatted, ScheduleModel } from '@modules/schedules/entities'
import { ScheduleRepository } from '@modules/schedules/repositories'
import { BadRequestException, Injectable } from '@nestjs/common'
import { I18nService } from 'nestjs-i18n'

@Injectable()
export class FindOneUseCase {
	constructor(
		private readonly scheduleRepository: ScheduleRepository,
		private readonly languageService: I18nService
	) {}

	async execute(where: FindOneDto): Promise<{ schedule: ScheduleFormatted } | null> {
		const keys: RequireAtLeastOne<ScheduleModel> | undefined = undefined

		if (where.callId) {
			keys!.CD_CHAMADA = where.callId
		}
		if (where.patientId) {
			keys!.CD_PACIENTE = where.patientId
		}
		if (where.specialistId) {
			keys!.CD_ESPECIALISTA = where.specialistId
		}
		if (where.confirmed) {
			keys!.VL_CONFIRMADO = where.confirmed ? 1 : 0
		}
		if (where.rangeEnd) {
			keys!.DT_FIM_RANGE = new Date(where.rangeEnd)
		}
		if (where.rangeStart) {
			keys!.DT_INI_RANGE = new Date(where.rangeStart)
		}

		if (!keys) {
			throw new BadRequestException(await this.languageService.translate('no-field'))
		}

		const foundSchedule = await this.scheduleRepository.getOne(keys, 'OR')

		if (!foundSchedule) {
			return null
		}

		return {
			schedule: foundSchedule
		}
	}
}
