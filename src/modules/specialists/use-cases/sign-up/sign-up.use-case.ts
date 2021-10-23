import { BaseUseCase } from '@common/domain/base'
import { splitCnpj, splitCpf, splitPhone } from '@common/utils'
import { welcomeEmailProps } from '@core/providers'
import { SignUpDto } from '@modules/specialists/dtos'
import { SpecialistFormatted, SpecialistModel } from '@modules/specialists/entities'
import { SpecialistRepository } from '@modules/specialists/repositories'
import { BadRequestException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { CryptService } from '@services/crypt'
import { MailerService } from '@services/mail'
import { I18nService } from 'nestjs-i18n'

@Injectable()
export class SignUpUseCase implements BaseUseCase<SpecialistModel> {
	constructor(
		private readonly specialistRepository: SpecialistRepository,
		private readonly languageService: I18nService,
		private readonly cryptService: CryptService,
		private readonly jwtService: JwtService,
		private readonly mailerService: MailerService
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
			phone,
			avatarUrl,
			about,
			cost
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

		// TODO: Upload to IBM S3
		// eslint-disable-next-line no-empty
		if (avatarUrl) {
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
			const [dddPhone, fullPhone] = splitPhone(
				+phone.replace('(', '').replace(')', '').replace(' ', '').replace('-', '')
			)
			finalPhone.push(dddPhone, fullPhone)
		}

		const createdSpecialist = await this.specialistRepository.create({
			NM_ESPECIALISTA: name,
			DS_EMAIL: email,
			DS_SENHA: password,
			DS_GENERO: gender,
			DT_NASCIMENTO: new Date(birth),
			NR_CPF: finalCpf[0],
			NR_CPF_DIGITO: finalCpf[1],
			NR_CNPJ: finalCnpj[0],
			NR_CNPJ_DIGITO: finalCnpj[1],
			NR_TELEFONE: finalPhone[0],
			NR_TELEFONE_DDD: finalPhone[1],
			NR_CRM: Number(crm),
			NR_CRP: Number(crp),
			DS_SOBRE: about,
			VL_CONSULTA: +cost
		})

		if (!createdSpecialist) {
			throw new BadRequestException()
		}

		const createdToken = this.jwtService.sign({
			id: createdSpecialist.id,
			name,
			email,
			role: 'specialist'
		})

		await this.mailerService.send({
			to: {
				address: email,
				name: createdSpecialist.name
			},
			...welcomeEmailProps({
				name: createdSpecialist.name
			})
		})

		return {
			token: createdToken,
			specialist: createdSpecialist
		}
	}
}
