import { Injectable } from '@nestjs/common'

import { CreateDto, FindManyDto } from './dtos'
import {
	ConfirmUseCase,
	CreateUseCase,
	FindByIdUseCase,
	FindManyUseCase
} from './use-cases'

@Injectable()
export class SchedulesService {
	constructor(
		private readonly createUseCase: CreateUseCase,
		private readonly findByIdUseCase: FindByIdUseCase,
		private readonly findManyUseCase: FindManyUseCase,
		private readonly confirmUseCase: ConfirmUseCase
	) {}

	async create(specialistId: number, data: CreateDto) {
		return this.createUseCase.execute(specialistId, data)
	}

	async getById(scheduleId: number) {
		return this.findByIdUseCase.execute(scheduleId)
	}

	async getMany(where: FindManyDto) {
		return this.findManyUseCase.execute(where)
	}

	async confirm(specialistId: number, scheduleId: number) {
		return this.confirmUseCase.execute(specialistId, scheduleId)
	}
}
