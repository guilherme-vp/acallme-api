import { RequireAtLeastOne } from '@core/types'
import { CallModel } from '@modules/calls/entities'
import { CallRepository } from '@modules/calls/repositories'
import { Injectable } from '@nestjs/common'

import { FindManyDto } from '../../dtos'

@Injectable()
export class FindManyUseCase {
	constructor(private readonly callRepository: CallRepository) {}

	async execute(where?: FindManyDto) {
		const keys: RequireAtLeastOne<CallModel> | undefined = undefined

		if (where?.recordId) {
			keys!.CD_PRONTUARIO = where.recordId
		}
		if (where?.scheduleId) {
			keys!.CD_AGENDA = where.scheduleId
		}

		const calls = await this.callRepository.getMany(keys)

		return calls
	}
}
