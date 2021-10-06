import { splitCnpj, splitCpf, splitPhone } from '@core/util'
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
		const {
			email,
			cnpj,
			cpf,
			crm,
			crp,
			password: userPassword,
			birth,
			gender,
			name,
			phone
		} = input

		const finalCnpj: number[] = []

		if (cnpj) {
			const [fullCnpj, digitsCnpj] = splitCnpj(cnpj)
			finalCnpj.push(fullCnpj, digitsCnpj)
		}

		const finalCpf: number[] = []

		if (cpf) {
			const [fullCpf, digitsCpf] = splitCpf(cpf)
			finalCpf.push(fullCpf, digitsCpf)
		}

		if (finalCnpj.length < 2 && finalCpf.length < 2) {
			throw new BadRequestException(
				await this.languageService.translate('specialist.cpnj-cpf-not-given')
			)
		}

		const specialistExists = await this.specialistRepository.existsEmailCnpj({
			email,
			cnpj: { digits: finalCnpj[0], full: finalCnpj[1] }
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
			NR_CPF: finalCpf[0],
			NR_CPF_DIGITO: finalCpf[1],
			NR_CNPJ: finalCnpj[0],
			NR_CNPJ_DIGITO: finalCnpj[1],
			NR_TELEFONE: finalPhone[0],
			NR_TELEFONE_DDD: finalPhone[1],
			NR_CRM: Number(crm),
			NR_CRP: Number(crp)
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
