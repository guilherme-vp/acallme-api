import { splitCpf, splitPhone } from '@core/util'
import { BaseUseCase } from '@domain/base'
import { Role } from '@domain/enums'
import { SignUpDto } from '@modules/patients/dtos'
import { PatientFormatted, PatientModel } from '@modules/patients/entities'
import { PatientRepository } from '@modules/patients/repositories'
import { formatPatient } from '@modules/patients/util'
import { SchedulesService } from '@modules/schedules/schedules.service'
import { BadRequestException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { CryptService } from '@services/crypt'
import * as datefns from 'date-fns'
import { I18nService } from 'nestjs-i18n'

@Injectable()
export class SignUpUseCase implements BaseUseCase<PatientModel> {
	constructor(
		private readonly patientRepository: PatientRepository,
		private readonly scheduleService: SchedulesService,
		private readonly languageService: I18nService,
		private readonly cryptService: CryptService,
		private readonly jwtService: JwtService
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
			const [dddPhone, fullPhone] = splitPhone(phone)
			finalPhone.push(dddPhone, fullPhone)
		}

		const createdPatient = await this.patientRepository.create({
			NM_PACIENTE: name,
			DS_EMAIL: email,
			DS_SENHA: password,
			DS_GENERO: gender,
			DT_NASCIMENTO: datefns.parse(birth, 'yyyy-dd-MM', new Date()),
			NR_CPF: fullCpf,
			NR_CPF_DIGITO: digitsCpf,
			NR_TELEFONE_DDD: finalPhone[0],
			NR_TELEFONE: finalPhone[1]
		})

		const createdSchedule = await this.scheduleService.create(
			createdPatient.CD_PACIENTE as number,
			Role.Patient
		)

		const patient = formatPatient({
			...createdPatient,
			CD_AGENDA_PACIENTE: createdSchedule.scheduleId
		})

		const createdToken = this.jwtService.sign({
			id: patient.id,
			name,
			email,
			role: 'patient'
		})

		return {
			token: createdToken,
			patient
		}
	}
}
