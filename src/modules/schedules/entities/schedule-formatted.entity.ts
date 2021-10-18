import { AppointmentFormatted } from '@modules/appointments/entities'
import { PatientFormatted } from '@modules/patients/entities'
import { SpecialistFormatted } from '@modules/specialists/entities'

export interface ScheduleFormatted {
	scheduleId: number
	appointmentId: number
	specialistId: number
	patientId?: number
	rangeStart: Date
	rangeEnd: Date
	confirmed?: boolean
	appointment: AppointmentFormatted
	specialist: SpecialistFormatted
	patient?: PatientFormatted
}
