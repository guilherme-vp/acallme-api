import { CallFormatted } from '@modules/calls/entities'
import { PatientFormatted } from '@modules/patients/entities'
import { SpecialistFormatted } from '@modules/specialists/entities'

export interface ScheduleFormatted {
	id: number
	specialistId: number
	callId?: number
	patientId?: number
	rangeStart: Date
	rangeEnd: Date
	confirmed?: boolean
	disabled?: boolean
	call?: CallFormatted
	specialist?: SpecialistFormatted
	patient?: PatientFormatted
}
