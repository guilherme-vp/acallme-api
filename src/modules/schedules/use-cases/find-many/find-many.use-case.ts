import { FindManyDto } from '@modules/schedules/dtos'
import { ScheduleFormatted, ScheduleModel } from '@modules/schedules/entities'
import { ScheduleRepository } from '@modules/schedules/repositories'
import { Injectable, Logger } from '@nestjs/common'
import _ from 'lodash'

@Injectable()
export class FindManyUseCase {
	private logger: Logger = new Logger('FindManySchedules')

	constructor(private readonly scheduleRepository: ScheduleRepository) {}

	async execute(where: FindManyDto): Promise<ScheduleFormatted[]> {
		const keys: Partial<ScheduleModel> = {}

		if (where.callId) {
			this.logger.log('Adding callId')
			keys!.CD_CHAMADA = +where.callId
		}
		if (where.patientId) {
			this.logger.log('Adding patientId')
			keys!.CD_PACIENTE = +where.patientId
		}
		if (where.specialistId) {
			this.logger.log('Adding specialistId')
			keys!.CD_ESPECIALISTA = +where.specialistId
		}
		if (where.confirmed) {
			this.logger.log('Adding confirmed')
			keys!.VL_CONFIRMADO = JSON.parse(where.confirmed) ? 1 : 0
		}
		if (where.rangeEnd) {
			this.logger.log('Adding rangeEnd')
			keys!.DT_FIM_RANGE = new Date(where.rangeEnd)
		}
		if (where.rangeStart) {
			this.logger.log('Adding rangeStart')
			keys!.DT_INI_RANGE = new Date(where.rangeStart)
		}
		if (where.disabled) {
			this.logger.log('Adding disabled')
			keys!.VL_CONFIRMADO = JSON.parse(where.disabled) ? 1 : 0
		}

		const foundSchedules = await this.scheduleRepository.getMany(
			!_.isEmpty(keys) ? keys : undefined
		)

		return foundSchedules
	}
}
