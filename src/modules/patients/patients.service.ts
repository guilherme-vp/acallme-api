import { Injectable } from '@nestjs/common'

import { SignUpDto, LoginDto, FindOneDto } from './dtos'
import { Patient } from './entities'
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

	async findById(id: number, select?: (keyof Patient)[]) {
		return this.findByIdUseCase.execute(id, select)
	}

	async findOne(fields: FindOneDto, method?: 'AND' | 'OR') {
		return this.findOneUseCase.execute(fields, method)
	}
}
