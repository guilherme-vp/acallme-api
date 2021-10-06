import { RequireAtLeastOne } from '@core/types'
import { Injectable } from '@nestjs/common'

import { SignUpDto, LoginDto } from './dtos'
import { PatientModel } from './entities'
import { SignUpUseCase, LoginUseCase, FindByIdUseCase, FindOneUseCase } from './use-cases'

@Injectable()
export class PatientService {
	constructor(
		private signUpUseCase: SignUpUseCase,
		private loginUseCase: LoginUseCase,
		private findByIdUseCase: FindByIdUseCase,
		private findOneUseCase: FindOneUseCase
	) {}

	async signUp(input: SignUpDto) {
		return this.signUpUseCase.execute(input)
	}

	async login(input: LoginDto) {
		return this.loginUseCase.execute(input)
	}

	async findById(id: number) {
		return this.findByIdUseCase.execute(id)
	}

	async findOne(fields: RequireAtLeastOne<PatientModel>) {
		return this.findOneUseCase.execute(fields)
	}
}
