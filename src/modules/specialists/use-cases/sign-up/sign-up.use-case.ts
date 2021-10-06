import { splitCpf, splitPhone } from '@core/util'
import { BaseUseCase } from '@domain/base'
import { SignUpDto } from '@modules/specialists/dtos'
import { SpecialistFormatted, SpecialistModel } from '@modules/specialists/entities'
import { SpecialistRepository } from '@modules/specialists/repositories'
import { formatSpecialist } from '@modules/specialists/util'
import { BadRequestException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { CryptService } from '@services/crypt'
import * as datefns from 'date-fns'
import { I18nService } from 'nestjs-i18n'

@Injectable()
export class SignUpUseCase implements BaseUseCase<SpecialistModel> {
	constructor(
		private readonly specialistRepository: SpecialistRepository,
		private readonly languageService: I18nService,
		private readonly cryptService: CryptService,
		private readonly jwtService: JwtService
	) {}

	async execute(
		input: SignUpDto
	): Promise<{ specialist: SpecialistFormatted; token: string }> {
		const { email, cpf, password: userPassword, birth, gender, name, phone } = input

		const [fullCpf, digitsCpf] = splitCpf(cpf)

		const specialistExists = await this.specialistRepository.existsEmailCpf({
			email,
			cpf: { digits: digitsCpf, full: fullCpf }
		})

		if (specialistExists) {
			throw new BadRequestException(
				await this.languageService.translate('auth.user-already-exists')
			)
		}

		const password = await this.cryptService.encrypt(userPassword)

		const finalPhone: number[] = []

		if (phone) {
			const [dddPhone, fullPhone] = splitPhone(phone)
			finalPhone.push(dddPhone, fullPhone)
		}

		const createdSpecialist = await this.specialistRepository.create({
			NM_ESPECIALISTA: name,
			DS_EMAIL: email,
			DS_SENHA: password,
			DS_GENERO: gender,
			DT_NASCIMENTO: datefns.parse(birth, 'dd/MM/yyyy', new Date()),
			NR_CPF: fullCpf,
			NR_CPF_DIGITO: digitsCpf,
			NR_TELEFONE: finalPhone[0],
			NR_TELEFONE_DDD: finalPhone[1]
		})

		const specialist = formatSpecialist(createdSpecialist)

		const createdToken = this.jwtService.sign({
			id: specialist.id,
			name,
			email,
			role: 'specialist'
		})

		return {
			token: createdToken,
			specialist
		}
	}
}
