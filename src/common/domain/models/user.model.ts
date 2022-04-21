import { UserGender } from '@common/domain/enums'

export interface UserModel {
	id: number
	email: string
	name: string
	password?: string | null
	birth: Date
	gender: UserGender
	avatarUrl?: string | null
	cpf?: string | null
	phone: string
}
