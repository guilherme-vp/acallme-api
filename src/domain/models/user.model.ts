import { UserGender } from '@domain/enums'

export class UserModel {
	cd_paciente?: number
	cd_agenda_paciente!: number
	nm_paciente!: string
	ds_email!: string
	ds_senha!: string
	dt_nascimento!: Date
	ds_genero!: UserGender
	nr_cpf!: number
	nr_cpf_digito!: number
	nr_telefone?: number
	nr_telefone_ddd?: number
}
