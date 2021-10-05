import { UserGender } from '@domain/enums'

export class UserModel {
	ds_email!: string
	ds_senha?: string
	dt_nascimento!: Date
	ds_genero!: UserGender
	nr_cpf!: number
	nr_cpf_digito!: number
	nr_telefone?: number
	nr_telefone_ddd?: number
}
