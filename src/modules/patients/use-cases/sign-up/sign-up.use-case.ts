import { BaseUseCase } from '@common/domain/base'
import { splitCpf, splitPhone } from '@common/utils'
import { welcomeEmailProps } from '@core/providers'
import { SignUpDto } from '@modules/patients/dtos'
import { PatientFormatted, PatientModel } from '@modules/patients/entities'
import { PatientRepository } from '@modules/patients/repositories'
import { BadRequestException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { CryptService } from '@services/crypt'
import { MailerService } from '@services/mail'
import * as datefns from 'date-fns'
import { I18nService } from 'nestjs-i18n'

@Injectable()
export class SignUpUseCase implements BaseUseCase<PatientModel> {
	constructor(
		private readonly patientRepository: PatientRepository,
		private readonly languageService: I18nService,
		private readonly cryptService: CryptService,
		private readonly jwtService: JwtService,
		private readonly mailerService: MailerService
	) {}

	async execute(input: SignUpDto): Promise<{ patient: PatientFormatted; token: string }> {
		const { email, cpf, password: userPassword, birth, gender, name, phone } = input

		const [fullCpf, digitsCpf] = splitCpf(cpf)

		const patientExists = await this.patientRepository.existsEmailCpf({
			email,
			cpf: { digits: digitsCpf, full: fullCpf }
		})

		if (patientExists) {
			throw new BadRequestException(
				await this.languageService.translate('auth.user-already-exists')
			)
		}

		const password = await this.cryptService.encrypt(userPassword)

		const finalPhone: number[] = []

		if (phone) {
			const [dddPhone, fullPhone] = splitPhone(+phone.replace(/() -/g, ''))
			finalPhone.push(dddPhone, fullPhone)
		}

		const createdPatient = await this.patientRepository.create({
			NM_PACIENTE: name,
			DS_EMAIL: email,
			DS_SENHA: password,
			DS_GENERO: gender,
			DT_NASCIMENTO: new Date(birth),
			NR_CPF: fullCpf,
			NR_CPF_DIGITO: digitsCpf,
			NR_TELEFONE_DDD: finalPhone[0],
			NR_TELEFONE: finalPhone[1]
		})

		if (!createdPatient) {
			throw new BadRequestException()
		}

		const { id } = createdPatient

		const createdToken = this.jwtService.sign({
			id,
			name,
			email,
			role: 'patient'
		})

		await this.mailerService.send({
			to: {
				address: email,
				name
			},
			...welcomeEmailProps({
				name
			})
		})

		delete createdPatient.password

		return {
			token: createdToken,
			patient: createdPatient
		}
	}
}
