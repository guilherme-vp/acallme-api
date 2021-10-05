import { UserModel } from '@domain/entities'

export class SpecialistModel extends UserModel {
	CD_ESPECIALISTA?: number
	CD_AGENDA_ESPECIALISTA?: number
	NM_ESPECIALISTA!: string
	NR_CNPJ?: string
	NR_CNPJ_DIGITO?: string
	NR_CRP?: number
	NR_CRM?: number
}
