import { Role } from '@domain/enums'
import { Injectable } from '@nestjs/common'

import { CreateUseCase } from './use-cases/create'

@Injectable()
export class SchedulesService {
	constructor(private readonly createUseCase: CreateUseCase) {}

	async create(userId: number, role: Role) {
		return this.createUseCase.execute(userId, role)
	}
}
