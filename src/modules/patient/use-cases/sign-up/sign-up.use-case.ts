import { Inject } from '@nestjs/common'
import { I18nService } from 'nestjs-i18n'

import { BaseUseCase } from '~domain/base'
import { SignUpDto } from '~modules/patient/dtos'
import { PatientModel } from '~modules/patient/graphql/models'
import { PatientRepository } from '~modules/patient/repositories'

export class SignUpUseCase implements BaseUseCase<PatientModel> {
	constructor(
		@Inject('PATIENT_REPOSITORY') private readonly patientRepository: PatientRepository,
		private readonly languageService: I18nService
	) {}

	async execute(input: SignUpDto) {
		const { email, cpf } = input

		const patientExists = await this.patientRepository.existsEmailCpf({ email, cpf })

		if (patientExists) {
			throw new Error(await this.languageService.translate('auth.user-already-exists'))
		}
	}
}
