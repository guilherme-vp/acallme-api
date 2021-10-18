import { UserFormattedModel } from '@common/domain/entities'

import { SpecialtyFormatted } from './specialty-formatted.entity'

export type SpecialistFormatted = UserFormattedModel & {
	cpf?: string
	cnpj?: string
	crp?: string
	crm?: string
	cost: number
	about: string
	specialties: SpecialtyFormatted[]
}
