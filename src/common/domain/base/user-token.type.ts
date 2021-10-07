import { Role } from '@common/domain/enums'

export interface UserToken {
	id: number
	email: string
	role: Role
	sub: number
	exp?: number
}
