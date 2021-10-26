import { Injectable } from '@nestjs/common'

import { CreateDto, DisableDto, FindManyDto, FindOneDto } from './dtos'
import {
	ConfirmUseCase,
	CreateUseCase,
	DisableUseCase,
	FindByIdUseCase,
	FindManyUseCase,
	FindOneUseCase
} from './use-cases'

@Injectable()
export class SchedulesService {
	constructor(
		private readonly confirmUseCase: ConfirmUseCase,
		private readonly createUseCase: CreateUseCase,
		private readonly disableUseCase: DisableUseCase,
		private readonly findByIdUseCase: FindByIdUseCase,
		private readonly findManyUseCase: FindManyUseCase,
		private readonly findOneUseCase: FindOneUseCase
	) {}

	async create(data: CreateDto, patientId: number) {
		return this.createUseCase.execute(data, patientId)
	}

	async disable(data: DisableDto, specialistId: number) {
		return this.disableUseCase.execute(data, specialistId)
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

	async confirm(scheduleId: number, specialistId: number, confirmed: number) {
		return this.confirmUseCase.execute(scheduleId, specialistId, confirmed)
	}
}
