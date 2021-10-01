import { UserModel } from '@domain/models'

export class SpecialistModel extends UserModel {
	nr_cnpj?: string
	nr_cnpj_digito?: string
	nr_crp?: number
	nr_crm?: number
}
