import { splitCnpj } from '@core/util'
import { LoginDto } from '@modules/specialists/dtos'
import { SpecialistFormatted } from '@modules/specialists/entities'
import { SpecialistRepository } from '@modules/specialists/repositories'
import { formatSpecialist } from '@modules/specialists/util'
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { CryptService } from '@services/crypt'
import { I18nService } from 'nestjs-i18n'

@Injectable()
export class LoginUseCase {
	constructor(
		private readonly specialistRepository: SpecialistRepository,
		private readonly cryptService: CryptService,
		private readonly jwtService: JwtService,
		private readonly languageService: I18nService
	) {}

	async execute(
		input: LoginDto
	): Promise<{ specialist: SpecialistFormatted; token: string }> {
		const { password, cnpj = '', email = '' } = input

		const [full, digits] = splitCnpj(cnpj)

		const foundSpecialist = await this.specialistRepository.getOne(
			{
				DS_EMAIL: email,
				NR_CNPJ: Number(`${full}${digits}`)
			},
			'OR'
		)

		if (!foundSpecialist) {
			throw new NotFoundException(
				await this.languageService.translate('auth.user-does-not-exists')
			)
		}

		const comparedPassword = await this.cryptService.compare(
			password,
			foundSpecialist.DS_SENHA as string
		)

		if (!comparedPassword) {
			throw new BadRequestException(
				await this.languageService.translate('auth.authentication-failed')
			)
		}

		const formattedSpecialist = formatSpecialist(foundSpecialist)

		const { id } = formattedSpecialist

		const payload = { id, email, sub: id, role: 'specialist' }

		const token = await this.jwtService.signAsync(payload)

		return {
			token,
			specialist: formattedSpecialist
		}
	}
}
