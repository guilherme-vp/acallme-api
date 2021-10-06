import { UserModel } from '@domain/entities'

export interface PatientModel extends UserModel {
	CD_PACIENTE?: number
	CD_AGENDA_PACIENTE?: number
	NM_PACIENTE: string
}
