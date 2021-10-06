import { UserFormattedModel } from '@domain/entities'

export interface SpecialistFormatted extends UserFormattedModel {
	cnpj?: string
	crp?: string
	crm?: string
}
