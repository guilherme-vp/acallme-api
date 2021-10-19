import { RequireAtLeastOne } from '@core/types'
import { FindManyDto } from '@modules/schedules/dtos'
import { ScheduleFormatted, ScheduleModel } from '@modules/schedules/entities'
import { ScheduleRepository } from '@modules/schedules/repositories'
import { Injectable } from '@nestjs/common'

@Injectable()
export class FindManyUseCase {
	constructor(private readonly scheduleRepository: ScheduleRepository) {}

	async execute(where: FindManyDto): Promise<ScheduleFormatted[]> {
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

		const foundSchedules = await this.scheduleRepository.getMany(keys)

		return foundSchedules
	}
}
