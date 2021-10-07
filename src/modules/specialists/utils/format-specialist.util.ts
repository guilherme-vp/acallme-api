import { formatCnpj, formatCpf, formatPhone } from '@core/utils'
import * as datefns from 'date-fns'

import { SpecialistFormatted, SpecialistModel } from '../entities'

export function formatSpecialist(data: SpecialistModel): SpecialistFormatted {
	const {
		CD_ESPECIALISTA: id,
		CD_AGENDA_ESPECIALISTA: scheduleId,
		DS_EMAIL: email,
		NM_ESPECIALISTA: name,
		DS_GENERO: gender,
		NR_TELEFONE: phone,
		NR_TELEFONE_DDD: ddd,
		NR_CPF: cpf,
		NR_CPF_DIGITO: digits,
		DT_NASCIMENTO: birth,
		NR_CNPJ: cnpj,
		NR_CNPJ_DIGITO: cnpjDigits,
		NR_CRM: crm,
		NR_CRP: crp
	} = data

	const formattedCpf = formatCpf(cpf, digits)

	let formattedCnpj: number | undefined = undefined

	if (cnpj && cnpjDigits) {
		formattedCnpj = formatCnpj(cnpj, cnpjDigits)
	}

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
		cpf: String(formattedCpf),
		cnpj: String(formattedCnpj),
		phone: String(formattedPhone),
		birth: birthDate,
		crm: String(crm),
		crp: String(crp)
	}
}
