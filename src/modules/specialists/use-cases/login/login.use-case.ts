import { LoginDto } from '@modules/specialists/dtos'
import { Specialist } from '@modules/specialists/entities'
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { CryptService } from '@services/crypt'
import { PrismaService } from '@services/prisma'
import { I18nService } from 'nestjs-i18n'

@Injectable()
export class LoginUseCase {
	private logger: Logger = new Logger('LoginPatient')

	constructor(
		private readonly cryptService: CryptService,
		private readonly jwtService: JwtService,
		private readonly languageService: I18nService,
		private readonly prisma: PrismaService
	) {}

	async execute(input: LoginDto): Promise<{ specialist: Specialist; token: string }> {
		const { password, username } = input

		this.logger.log('Creating specialist')

		let cnpj = ''

		if (username.replace(/.-\//, '').length === 14) {
			this.logger.log('splitting cnpj if valid')

			cnpj = username
		}

		this.logger.log('Searching for specialist with given email or cnpj')
		const foundSpecialist = await this.prisma.specialist.findFirst({
			where: {
				OR: [
					{
						email: username
					},
					{
						cnpj
					}
				]
			}
		})

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

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password: foundSpecialistPassword, ...specialistWithoutPassword } =
			foundSpecialist

		this.logger.log('Returning user')
		return {
			token,
			specialist: specialistWithoutPassword
		}
	}
}
