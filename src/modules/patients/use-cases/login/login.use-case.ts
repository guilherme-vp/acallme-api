import { LoginDto } from '@modules/patients/dtos'
import { Patient } from '@modules/patients/entities'
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { CryptService } from '@services/crypt'
import { PrismaService } from '@services/prisma'
import { I18nService } from 'nestjs-i18n'

@Injectable()
export class LoginUseCase {
	private logger: Logger = new Logger('PatientLogin')

	constructor(
		private readonly cryptService: CryptService,
		private readonly jwtService: JwtService,
		private readonly languageService: I18nService,
		private readonly prisma: PrismaService
	) {}

	async execute(input: LoginDto): Promise<{ patient: Patient; token: string }> {
		const { password, username } = input

		this.logger.log('Searching for patient with given email or cpf')
		const foundPatient = await this.prisma.patient.findFirst({
			where: {
				OR: [
					{
						email: username
					},
					{
						cpf: username
					}
				]
			}
		})

		if (!foundPatient) {
			this.logger.error('Patient not found')
			throw new NotFoundException(
				await this.languageService.translate('auth.user-does-not-exists')
			)
		}

		const { id, password: patientPassword } = foundPatient

		this.logger.log('Comparing passwords')
		const comparedPassword = await this.cryptService.compare(password, patientPassword)

		if (!comparedPassword) {
			this.logger.error('Incorrect password')
			throw new BadRequestException(
				await this.languageService.translate('auth.authentication-failed')
			)
		}

		const payload = { id, email: foundPatient.email, sub: id, role: 'patient' }

		this.logger.log('Creating JWT')
		const token = await this.jwtService.signAsync(payload)

		const { password: foundPassword, ...patientWithoutPassword } = foundPatient

		this.logger.log('Returning user')
		return {
			token,
			patient: patientWithoutPassword
		}
	}
}
