import { UserGender } from '@common/domain/enums'
import { ScheduleFormatted } from '@modules/schedules/entities'

export interface UserFormattedModel {
	id?: number
	email: string
	name: string
	password: string
	avatarUrl?: string
	birth: string
	gender: UserGender
	cpf: string
	phone: string
	schedule?: ScheduleFormatted[]
}
