import { UserGender } from '@common/domain/enums'

export interface UserModel {
	DS_EMAIL: string
	DS_SENHA: string
	DT_NASCIMENTO: Date
	DS_GENERO: UserGender
	IM_AVATAR_URL?: string
	NR_CPF: number
	NR_CPF_DIGITO: number
	NR_TELEFONE: number
	NR_TELEFONE_DDD: number
}
