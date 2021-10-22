import { RequireAtLeastOne } from '@core/types'
import { CallModel } from '@modules/calls/entities'
import { CallRepository } from '@modules/calls/repositories'
import { Injectable } from '@nestjs/common'
import _ from 'lodash'

import { FindManyDto } from '../../dtos'

@Injectable()
export class FindManyUseCase {
	constructor(private readonly callRepository: CallRepository) {}

	async execute(where?: FindManyDto) {
		const keys: Partial<CallModel> = {}

		if (where?.recordId) {
			keys!.CD_PRONTUARIO = where.recordId
		}
		if (where?.scheduleId) {
			keys!.CD_AGENDA = where.scheduleId
		}

		const calls = await this.callRepository.getMany(!_.isEmpty(keys) ? keys : undefined)

		return calls
	}
}
