import { Injectable } from '@nestjs/common'

import { SignUpDto } from '../dtos'
import { SignUpUseCase } from './sign-up'

@Injectable()
export class UseCasesService {
	constructor(private readonly signUpUseCase: SignUpUseCase) {}

	async signUp(input: SignUpDto) {
		return this.signUpUseCase.execute(input)
	}
}
