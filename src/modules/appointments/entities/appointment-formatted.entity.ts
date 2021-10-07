export interface AppointmentFormatted {
	id: number
	recordId?: number
	specialistSchedId: number
	patientSchedId: number
	cost: number
	scheduled: Date
	confirmed?: boolean
}
