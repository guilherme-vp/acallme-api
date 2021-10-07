import { Role } from '@common/domain/enums'
import { Injectable } from '@nestjs/common'

import { FindPatientUseCase, FindSpecialistUseCase } from './use-cases'
import { CreateUseCase } from './use-cases/create'

@Injectable()
export class SchedulesService {
	constructor(
		private readonly createUseCase: CreateUseCase,
		private readonly findSpecialistUseCase: FindSpecialistUseCase,
		private readonly findPatientUseCase: FindPatientUseCase
	) {}

	async create(userId: number, role: Role) {
		return this.createUseCase.execute(userId, role)
	}

	async getPatientSchedule(patientId: number) {
		return this.findPatientUseCase.execute(patientId)
	}

	async getSpecialistSchedule(specialistId: number) {
		return this.findSpecialistUseCase.execute(specialistId)
	}
}
