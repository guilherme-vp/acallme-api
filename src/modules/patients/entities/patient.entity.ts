import { UserModel } from '@domain/entities'

export class PatientModel extends UserModel {
	CD_PACIENTE?: number
	CD_AGENDA_PACIENTE?: number
	NM_PACIENTE!: string
}
