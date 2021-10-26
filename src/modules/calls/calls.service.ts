import { Injectable } from '@nestjs/common'

import { CreateDto, FindManyDto } from './dtos'
import { CreateUseCase, FindByIdUseCase, FindManyUseCase } from './use-cases'

@Injectable()
export class CallService {
	constructor(
		private readonly findManyUseCase: FindManyUseCase,
		private readonly findByIdUseCase: FindByIdUseCase,
		private readonly createUseCase: CreateUseCase
	) {}

	async findMany(fields?: FindManyDto) {
		return this.findManyUseCase.execute(fields)
	}

	async findById(callId: number) {
		return this.findByIdUseCase.execute(callId)
	}

	async create(input: CreateDto) {
		return this.createUseCase.execute(input)
	}
}
