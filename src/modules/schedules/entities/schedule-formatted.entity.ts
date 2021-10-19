import { AppointmentFormatted } from '@modules/appointments/entities'
import { PatientFormatted } from '@modules/patients/entities'
import { SpecialistFormatted } from '@modules/specialists/entities'

export interface ScheduleFormatted {
	id: number
	specialistId: number
	appointmentId?: number
	patientId?: number
	rangeStart: Date
	rangeEnd: Date
	confirmed?: boolean
	disabled?: boolean
	appointment?: AppointmentFormatted
	specialist?: SpecialistFormatted
	patient?: PatientFormatted
}
