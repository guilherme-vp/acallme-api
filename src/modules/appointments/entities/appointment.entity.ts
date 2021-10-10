import { PatientModel } from '@modules/patients/entities'
import { SpecialistModel } from '@modules/specialists/entities'

export interface AppointmentModel {
	CD_CONSULTA: number
	CD_PRONTUARIO?: number
	CD_AGENDA_ESPECIALISTA: number
	CD_AGENDA_PACIENTE: number
	VL_CONSULTA: number
	DT_CONSULTA: Date
	VL_CONFIRMADO?: number
	P: PatientModel
	S: SpecialistModel
}
