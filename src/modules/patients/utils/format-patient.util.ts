import { formatCpf, formatPhone } from '@common/utils'
import * as datefns from 'date-fns'

import { PatientFormatted, PatientModel } from '../entities'

export function formatPatient(data: PatientModel): PatientFormatted | undefined {
	if (!data || !data.CD_PACIENTE) {
		return
	}

	const {
		CD_PACIENTE: id,
		DS_SENHA: password,
		DS_EMAIL: email,
		IM_AVATAR_URL: avatarUrl,
		NM_PACIENTE: name,
		DS_GENERO: gender,
		NR_TELEFONE: phone,
		NR_TELEFONE_DDD: ddd,
		NR_CPF: cpf,
		NR_CPF_DIGITO: digits,
		DT_NASCIMENTO: birth
	} = data

	const formattedCpf = formatCpf(cpf, digits)
	const formattedPhone = formatPhone(ddd, phone)

	const birthDate = datefns.format(birth, 'dd/MM/yyyy')

	return {
		id,
		email,
		password,
		avatarUrl,
		name,
		gender,
		cpf: String(formattedCpf),
		phone: String(formattedPhone),
		birth: birthDate
	}
}
