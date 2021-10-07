import { UserFormattedModel } from '@common/domain/entities'

export type SpecialistFormatted = UserFormattedModel & {
	cpf?: string
	cnpj?: string
	crp?: string
	crm?: string
}
