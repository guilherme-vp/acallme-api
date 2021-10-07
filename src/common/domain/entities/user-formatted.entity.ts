import { UserGender } from '@common/domain/enums'

export interface UserFormattedModel {
	id?: number
	scheduleId?: number
	email: string
	name: string
	password?: string
	birth: string
	gender: UserGender
	cpf: string
	phone?: string
}
