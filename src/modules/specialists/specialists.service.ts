import { Injectable } from '@nestjs/common'

import { SignUpDto, LoginDto, FindOneDto, FindManyDto } from './dtos'
import { Specialist } from './entities'
import {
	SignUpUseCase,
	LoginUseCase,
	FindByIdUseCase,
	FindOneUseCase,
	FindManyUseCase
} from './use-cases'

@Injectable()
export class SpecialistService {
	constructor(
		private signUpUseCase: SignUpUseCase,
		private loginUseCase: LoginUseCase,
		private findByIdUseCase: FindByIdUseCase,
		private findOneUseCase: FindOneUseCase,
		private findManyUseCase: FindManyUseCase
	) {}

	async signUp(input: SignUpDto) {
		return this.signUpUseCase.execute(input)
	}

	async login(input: LoginDto) {
		return this.loginUseCase.execute(input)
	}

	async findById(id: number, select?: Record<keyof Specialist, boolean>) {
		return this.findByIdUseCase.execute(id, select)
	}

	async findOne(fields: FindOneDto, method?: 'AND' | 'OR') {
		return this.findOneUseCase.execute(fields, method)
	}

	async findMany(fields: FindManyDto) {
		return this.findManyUseCase.execute(fields)
	}
}
