import { UserGender } from '~domain/enums'

export class UserModel {
	id!: string
	name!: string
	email!: string
	password!: string
	birth!: Date
	cpf!: string
	gender!: UserGender
	isEmailVerified?: boolean
	phone?: string
	createdAt!: Date
	updatedAt!: Date
}
