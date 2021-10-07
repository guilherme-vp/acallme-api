import { UserModel } from '@common/domain/entities'

export type SpecialistModel = UserModel & {
	CD_ESPECIALISTA?: number
	CD_AGENDA_ESPECIALISTA?: number
	NM_ESPECIALISTA: string
	NR_CPF?: number
	NR_CPF_DIGITO?: number
	NR_CNPJ?: number
	NR_CNPJ_DIGITO?: number
	NR_CRP?: number
	NR_CRM?: number
}
