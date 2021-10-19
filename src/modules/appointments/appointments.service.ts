import { RequireAtLeastOne } from '@core/types'
import { Injectable } from '@nestjs/common'

import { CreateDto } from './dtos'
import { AppointmentModel } from './entities'
import {
	ConfirmUseCase,
	CreateUseCase,
	FindByIdUseCase,
	FindManyUseCase
} from './use-cases'

@Injectable()
export class AppointmentService {
	constructor(
		private findManyUseCase: FindManyUseCase,
		private findByIdUseCase: FindByIdUseCase,
		private createUseCase: CreateUseCase,
		private confirmUseCase: ConfirmUseCase
	) {}

	async findMany(where?: RequireAtLeastOne<AppointmentModel>) {
		return this.findManyUseCase.execute(where)
	}

	async findById(appointmentId: number) {
		return this.findByIdUseCase.execute(appointmentId)
	}

	async create(input: CreateDto) {
		return this.createUseCase.execute(input)
	}

	async confirm(specialistId: number, appointmentId: number) {
		return this.confirmUseCase.execute(specialistId, appointmentId)
	}
}
