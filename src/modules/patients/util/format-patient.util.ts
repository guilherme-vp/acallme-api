import { formatCpf, formatPhone } from '@core/util'
import * as datefns from 'date-fns'

import { PatientModel } from '../entities'

export function formatPatient(data: PatientModel) {
	const {
		CD_PACIENTE: id,
		CD_AGENDA_PACIENTE: scheduleId,
		DS_EMAIL: email,
		NM_PACIENTE: name,
		DS_GENERO: gender,
		NR_TELEFONE: phone,
		NR_TELEFONE_DDD: ddd,
		NR_CPF: cpf,
		NR_CPF_DIGITO: digits,
		DT_NASCIMENTO: birth
	} = data

	const formattedCpf = formatCpf(cpf, digits)

	let formattedPhone: number | undefined = undefined

	if (ddd && phone) {
		formattedPhone = formatPhone(ddd, phone)
	}

	const birthDate = datefns.format(birth, 'dd/MM/yyyy')

	return {
		id,
		scheduleId,
		email,
		name,
		gender,
		cpf: formattedCpf,
		phone: formattedPhone,
		birth: birthDate
	}
}
