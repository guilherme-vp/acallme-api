import { Injectable } from '@nestjs/common'
import { I18nService } from 'nestjs-i18n'

import { SignUpDto } from '../dtos'
import { PatientRepository } from '../repositories'
import { SignUpUseCase } from './sign-up'

@Injectable()
export class UseCasesService {
	constructor(
		private readonly patientRepository: PatientRepository,
		private readonly languageService: I18nService
	) {}

	async signUp(input: SignUpDto) {
		const handler = new SignUpUseCase(this.patientRepository, this.languageService)

		return handler.execute(input)
	}
}
