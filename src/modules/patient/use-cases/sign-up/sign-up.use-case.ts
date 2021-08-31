import { Injectable } from '@nestjs/common'
import { I18nService } from 'nestjs-i18n'

import { BaseUseCase } from '~domain/base'
import { PatientModel } from '~domain/models'
import { SignUpDto } from '~modules/patient/dtos'
import { PatientRepository } from '~modules/patient/repositories'
import { CryptService } from '~services/crypt'

@Injectable()
export class SignUpUseCase implements BaseUseCase<PatientModel> {
	constructor(
		private readonly patientRepository: PatientRepository,
		private readonly languageService: I18nService,
		private readonly cryptService: CryptService
	) {}

	async execute(input: SignUpDto) {
		const { email, cpf, password: userPassword, ...fields } = input

		const patientExists = await this.patientRepository.existsEmailCpf({ email, cpf })

		if (patientExists) {
			throw new Error(await this.languageService.translate('auth.user-already-exists'))
		}

		const password = await this.cryptService.encrypt(userPassword)

		return this.patientRepository.create({ ...fields, email, cpf, password })
	}
}
