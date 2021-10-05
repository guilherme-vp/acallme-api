import { BaseUseCase } from '@domain/base'
import { SignUpDto } from '@modules/patients/dtos'
import { PatientRepository } from '@modules/patients/repositories'
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { CryptService } from '@services/crypt'
import * as datefns from 'date-fns'
import { I18nService } from 'nestjs-i18n'

import { PatientModel } from '../../entities'

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
			throw new Error(await this.languageService.translate('auth.user-already-exists'))
		}

		const password = await this.cryptService.encrypt(userPassword)

		const stringifiedPhone = String(phone)
		const dddPhone = +stringifiedPhone.substring(0, 2)
		const fullPhone = +stringifiedPhone.substring(2, stringifiedPhone.length)

		const createdPatient = await this.patientRepository.create({
			nm_paciente: name,
			ds_email: email,
			ds_senha: password,
			ds_genero: gender,
			dt_nascimento: datefns.parse(birth, 'dd/MM/yyyy', new Date()),
			nr_cpf: fullCpf,
			nr_cpf_digito: digitsCpf,
			nr_telefone: fullPhone,
			nr_telefone_ddd: dddPhone
		})

		const createdToken = this.jwtService.sign({
			id: createdPatient.cd_paciente,
			name,
			email
		})

		delete createdPatient.ds_senha

		return {
			token: createdToken,
			patient: createdPatient
		}
	}
}
