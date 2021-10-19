import { UserModel } from '@common/domain/entities'

export type SpecialistModel = UserModel & {
	CD_ESPECIALISTA?: number
	NM_ESPECIALISTA: string
	NR_CNPJ?: number
	NR_CNPJ_DIGITO?: number
	NR_CRP?: number
	NR_CRM?: number
	DS_SOBRE: string
	IM_AVATAR_URL?: string
	VL_CONSULTA: number
}
