import { splitCpf } from '@common/utils'
import { LoginDto } from '@modules/patients/dtos'
import { PatientFormatted } from '@modules/patients/entities'
import { PatientRepository } from '@modules/patients/repositories'
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { CryptService } from '@services/crypt'
import { I18nService } from 'nestjs-i18n'

@Injectable()
export class LoginUseCase {
	private logger: Logger = new Logger('Patients')

	constructor(
		private readonly patientRepository: PatientRepository,
		private readonly cryptService: CryptService,
		private readonly jwtService: JwtService,
		private readonly languageService: I18nService
	) {}

	async execute(input: LoginDto): Promise<{ patient: PatientFormatted; token: string }> {
		const { password, username } = input

		this.logger.log('Creating patient')

		let cpf = 0

		if (username.replace(/.-/, '').length === 11) {
			this.logger.log('splitting cpf if valid')
			const [full] = splitCpf(username)

			cpf = full
		}

		this.logger.log('Searching for patient with given email or cpf')
		const foundPatient = await this.patientRepository.getOne(
			{
				DS_EMAIL: username,
				NR_CPF: cpf
			},
			'OR'
		)

		if (!foundPatient) {
			this.logger.error('Patient not found')
			throw new NotFoundException(
				await this.languageService.translate('auth.user-does-not-exists')
			)
		}

		const { id, password: patientPassword } = foundPatient

		this.logger.log('Comparing passwords')
		const comparedPassword = await this.cryptService.compare(
			password,
			patientPassword as string
		)

		if (!comparedPassword) {
			this.logger.error('Incorrect password')
			throw new BadRequestException(
				await this.languageService.translate('auth.authentication-failed')
			)
		}

		const payload = { id, email: foundPatient.email, sub: id, role: 'patient' }

		this.logger.log('Creating JWT')
		const token = await this.jwtService.signAsync(payload)

		delete foundPatient.password

		this.logger.log('Returning user')
		return {
			token,
			patient: foundPatient
		}
	}
}
