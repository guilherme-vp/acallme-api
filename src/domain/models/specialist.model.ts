import { UserModel } from '@domain/models'

export class SpecialistModel extends UserModel {
	cd_especialista?: number
	cd_agenda_especialista!: number
	nm_especialista!: string
	nr_cnpj?: string
	nr_cnpj_digito?: string
	nr_crp?: number
	nr_crm?: number
}
