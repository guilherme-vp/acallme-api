import { splitCnpj } from '@common/utils'
import { LoginDto } from '@modules/specialists/dtos'
import { SpecialistFormatted } from '@modules/specialists/entities'
import { SpecialistRepository } from '@modules/specialists/repositories'
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { CryptService } from '@services/crypt'
import { I18nService } from 'nestjs-i18n'

@Injectable()
export class LoginUseCase {
	private logger: Logger = new Logger('LoginPatient')

	constructor(
		private readonly specialistRepository: SpecialistRepository,
		private readonly cryptService: CryptService,
		private readonly jwtService: JwtService,
		private readonly languageService: I18nService
	) {}

	async execute(
		input: LoginDto
	): Promise<{ specialist: SpecialistFormatted; token: string }> {
		const { password, username } = input

		this.logger.log('Creating specialist')

		let cnpj = 0

		if (username.replace(/.-\//, '').length === 14) {
			this.logger.log('splitting cnpj if valid')
			const [full] = splitCnpj(username)

			cnpj = full
		}

		this.logger.log('Searching for specialist with given email or cnpj')
		const foundSpecialist = await this.specialistRepository.getOne(
			{
				DS_EMAIL: username,
				NR_CNPJ: cnpj
			},
			'OR'
		)

		if (!foundSpecialist) {
			this.logger.error('Specialist not found')
			throw new NotFoundException(
				await this.languageService.translate('auth.user-does-not-exists')
			)
		}

		const { id, password: specialistPassword } = foundSpecialist

		this.logger.log('Comparing passwords')
		const comparedPassword = await this.cryptService.compare(
			password,
			specialistPassword as string
		)

		if (!comparedPassword) {
			this.logger.error('Incorrect password')
			throw new BadRequestException(
				await this.languageService.translate('auth.authentication-failed')
			)
		}

		const payload = { id, email: foundSpecialist.email, sub: id, role: 'specialist' }

		this.logger.log('Creating JWT')
		const token = await this.jwtService.signAsync(payload)

		delete foundSpecialist.password

		this.logger.log('Returning user')
		return {
			token,
			specialist: foundSpecialist
		}
	}
}
