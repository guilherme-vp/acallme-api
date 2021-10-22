import { formatCnpj, formatCpf, formatPhone } from '@common/utils'
import * as datefns from 'date-fns'

import { SpecialistFormatted, SpecialistModel } from '../entities'

export function formatSpecialist(data: SpecialistModel): SpecialistFormatted | undefined {
	if (!data || !data.CD_ESPECIALISTA) {
		return
	}

	const {
		CD_ESPECIALISTA: id,
		DS_EMAIL: email,
		DS_SOBRE: about,
		VL_CONSULTA: cost,
		NM_ESPECIALISTA: name,
		DS_GENERO: gender,
		NR_TELEFONE: phone,
		NR_TELEFONE_DDD: ddd,
		NR_CPF: cpf,
		NR_CPF_DIGITO: digits,
		DT_NASCIMENTO: birth,
		NR_CNPJ: cnpj,
		NR_CNPJ_DIGITO: cnpjDigits,
		DS_SENHA: password
	} = data

	const formattedCpf = formatCpf(cpf, digits).toString()

	let formattedCnpj: string | undefined = undefined

	if (cnpj && cnpjDigits) {
		formattedCnpj = formatCnpj(cnpj, cnpjDigits).toString()
	}

	let formattedPhone = ''

	if (ddd && phone) {
		formattedPhone = formatPhone(ddd, phone).toString()
	}

	const birthDate = datefns.format(birth, 'dd/MM/yyyy')

	return {
		id,
		email,
		name,
		gender,
		cpf: formattedCpf,
		cnpj: formattedCnpj,
		phone: formattedPhone,
		birth: birthDate,
		crm: data.NR_CRM?.toString(),
		crp: data.NR_CRP?.toString(),
		about,
		cost,
		avatarUrl: data.IM_AVATAR_URL?.toString(),
		password
	}
}
