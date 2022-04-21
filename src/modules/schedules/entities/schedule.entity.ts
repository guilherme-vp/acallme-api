export interface Schedule {
	id: number
	callId?: number | null
	specialistId: number
	patientId?: number | null
	startsAt: Date
	endsAt: Date
	confirmed?: boolean | null
	disabled?: boolean | null
}
