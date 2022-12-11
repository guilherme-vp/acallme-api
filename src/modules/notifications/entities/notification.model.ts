import { NotificationsEnum } from './enums'

export interface NotificationModel {
	id: string
	scheduleId: number
	avatar?: string
	name?: string
	type: NotificationsEnum
	when?: Date
	isConfirmed?: boolean
	createdAt: Date
}
