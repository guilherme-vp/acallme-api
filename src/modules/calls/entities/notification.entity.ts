export interface Notification {
	id: string
	appointmentId: number
	avatar: string | null
	name: string
	type: 'appointment_confirmation' | 'appointment_new' | 'appointment_call'
	when?: Date
	isUnRead?: boolean
	isConfirmed?: boolean
	isFinished?: boolean
	createdAt: Date
}
