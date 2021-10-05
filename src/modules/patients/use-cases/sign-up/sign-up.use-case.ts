import { BaseUseCase } from '@domain/base'
import { SignUpDto } from '@modules/patients/dtos'
import { PatientModel } from '@modules/patients/entities'
import { PatientRepository } from '@modules/patients/repositories'
import { formatPatient } from '@modules/patients/util'
import { BadRequestException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { CryptService } from '@services/crypt'
import * as datefns from 'date-fns'
import { I18nService } from 'nestjs-i18n'

@Injectable()
export class SignUpUseCase implements BaseUseCase<PatientModel> {
	constructor(
		private readonly patientRepository: PatientRepository,
		private readonly languageService: I18nService,
		private readonly cryptService: CryptService,
		private readonly jwtService: JwtService
	) {}

	async execute(input: SignUpDto) {
		const { email, cpf, password: userPassword, birth, gender, name, phone } = input

		const filteredCpf = cpf.replace(/[.-]/g, '')

		const fullCpf = +filteredCpf.substring(0, filteredCpf.length - 2)
		const digitsCpf = +filteredCpf.substring(filteredCpf.length - 2)

		const patientExists = await this.patientRepository.existsEmailCpf({
			email,
			cpf: { digits: digitsCpf, full: fullCpf }
		})

		if (patientExists) {
			throw new BadRequestException(await this.languageService.translate('auth.user-already-exists'))
		}

		const password = await this.cryptService.encrypt(userPassword)

		const stringifiedPhone = String(phone)
		const dddPhone = +stringifiedPhone.substring(0, 2)
		const fullPhone = +stringifiedPhone.substring(2, stringifiedPhone.length)

		const createdPatient = await this.patientRepository.create({
			NM_PACIENTE: name,
			DS_EMAIL: email,
			DS_SENHA: password,
			DS_GENERO: gender,
			DT_NASCIMENTO: datefns.parse(birth, 'dd/MM/yyyy', new Date()),
			NR_CPF: fullCpf,
			NR_CPF_DIGITO: digitsCpf,
			NR_TELEFONE: fullPhone,
			NR_TELEFONE_DDD: dddPhone
		})

		const createdToken = this.jwtService.sign({
			id: createdPatient.CD_PACIENTE,
			name,
			email,
			role: 'patient'
		})

		const patient = formatPatient(createdPatient)

		return {
			token: createdToken,
			patient
		}
	}
}
