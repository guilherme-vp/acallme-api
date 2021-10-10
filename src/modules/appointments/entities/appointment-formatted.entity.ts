import { PatientFormatted } from '@modules/patients/entities'
import { SpecialistFormatted } from '@modules/specialists/entities'

export interface AppointmentFormatted {
	id: number
	recordId?: number
	specialistSchedId: number
	patientSchedId: number
	cost: number
	scheduled: string
	confirmed?: boolean
	patient: PatientFormatted
	specialist: SpecialistFormatted
}
