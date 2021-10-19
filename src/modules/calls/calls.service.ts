import { RequireAtLeastOne } from '@core/types'
import { Injectable } from '@nestjs/common'

import { CreateDto } from './dtos'
import { CallModel } from './entities'
import { CreateUseCase, FindByIdUseCase, FindManyUseCase } from './use-cases'

@Injectable()
export class CallService {
	constructor(
		private findManyUseCase: FindManyUseCase,
		private findByIdUseCase: FindByIdUseCase,
		private createUseCase: CreateUseCase
	) {}

	async findMany(where?: RequireAtLeastOne<CallModel>) {
		return this.findManyUseCase.execute(where)
	}

	async findById(callId: number) {
		return this.findByIdUseCase.execute(callId)
	}

	async create(input: CreateDto) {
		return this.createUseCase.execute(input)
	}
}
