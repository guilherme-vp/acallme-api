import { Injectable } from '@nestjs/common'

import { CreateDto, FindManyDto, FindOneDto } from './dtos'
import {
	ConfirmUseCase,
	CreateUseCase,
	FindByIdUseCase,
	FindManyUseCase,
	FindOneUseCase
} from './use-cases'

@Injectable()
export class SchedulesService {
	constructor(
		private readonly createUseCase: CreateUseCase,
		private readonly confirmUseCase: ConfirmUseCase,
		private readonly findByIdUseCase: FindByIdUseCase,
		private readonly findManyUseCase: FindManyUseCase,
		private readonly findOneUseCase: FindOneUseCase
	) {}

	async create(specialistId: number, data: CreateDto) {
		return this.createUseCase.execute(specialistId, data)
	}

	async getById(scheduleId: number) {
		return this.findByIdUseCase.execute(scheduleId)
	}

	async getOne(where: FindOneDto) {
		return this.findOneUseCase.execute(where)
	}

	async getMany(where: FindManyDto) {
		return this.findManyUseCase.execute(where)
	}

	async confirm(specialistId: number, scheduleId: number) {
		return this.confirmUseCase.execute(specialistId, scheduleId)
	}
}
