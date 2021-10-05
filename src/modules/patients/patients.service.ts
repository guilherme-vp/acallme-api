import { Injectable } from '@nestjs/common'

import { SignUpDto } from './dtos'
import { SignUpUseCase, FindByIdUseCase } from './use-cases'

@Injectable()
export class PatientService {
	constructor(private signUpUseCase: SignUpUseCase, private findByIdUseCase: FindByIdUseCase) {}

	async signUp(input: SignUpDto) {
		return this.signUpUseCase.execute(input)
	}

	async findById(id: number) {
		return this.findByIdUseCase.execute(id)
	}
}
