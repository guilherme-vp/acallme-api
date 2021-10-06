import { UserGender } from '@domain/enums'

export interface UserModel {
	DS_EMAIL: string
	DS_SENHA?: string
	DT_NASCIMENTO: Date
	DS_GENERO: UserGender
	NR_CPF: number
	NR_CPF_DIGITO: number
	NR_TELEFONE?: number
	NR_TELEFONE_DDD?: number
}
