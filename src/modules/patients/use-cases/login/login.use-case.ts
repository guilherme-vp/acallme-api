import { splitCpf } from '@common/utils'
import { LoginDto } from '@modules/patients/dtos'
import { PatientFormatted } from '@modules/patients/entities'
import { PatientRepository } from '@modules/patients/repositories'
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { CryptService } from '@services/crypt'
import { I18nService } from 'nestjs-i18n'

@Injectable()
export class LoginUseCase {
	constructor(
		private readonly patientRepository: PatientRepository,
		private readonly cryptService: CryptService,
		private readonly jwtService: JwtService,
		private readonly languageService: I18nService
	) {}

	async execute(input: LoginDto): Promise<{ patient: PatientFormatted; token: string }> {
		const { password, username } = input

		let cpf = 0

		if (username.replace(/.-/, '').length === 11) {
			const [full] = splitCpf(username)

			cpf = full
		}

		const foundPatient = await this.patientRepository.getOne(
			{
				DS_EMAIL: username,
				NR_CPF: cpf
			},
			'OR'
		)

		if (!foundPatient) {
			throw new NotFoundException(
				await this.languageService.translate('auth.user-does-not-exists')
			)
		}

		const { id, password: patientPassword } = foundPatient

		const comparedPassword = await this.cryptService.compare(
			password,
			patientPassword as string
		)

		if (!comparedPassword) {
			throw new BadRequestException(
				await this.languageService.translate('auth.authentication-failed')
			)
		}

		const payload = { id, email: foundPatient.email, sub: id, role: 'patient' }

		const token = await this.jwtService.signAsync(payload)

		return {
			token,
			patient: foundPatient
		}
	}
}
