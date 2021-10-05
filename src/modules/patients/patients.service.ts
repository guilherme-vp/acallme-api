import { Injectable } from '@nestjs/common'

import { SignUpDto } from './dtos'
import { SignUpUseCase } from './use-cases'

@Injectable()
export class PatientService {
	constructor(private signUpUseCase: SignUpUseCase) {}

	async signUp(input: SignUpDto) {
		return this.signUpUseCase.execute(input)
	}
}
