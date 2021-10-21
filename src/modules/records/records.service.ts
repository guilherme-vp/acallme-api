import { Injectable } from '@nestjs/common'

import { CreateDto } from './dtos'
import { CreateUseCase, FindByIdUseCase } from './use-cases'

@Injectable()
export class RecordService {
	constructor(
		private findByIdUseCase: FindByIdUseCase,
		private createUseCase: CreateUseCase
	) {}

	async findById(recordId: number) {
		return this.findByIdUseCase.execute(recordId)
	}

	async create(input: CreateDto) {
		return this.createUseCase.execute(input)
	}
}
