import { UserModel } from '@domain/models'

export class PatientModel extends UserModel {
	cd_paciente?: number
	cd_agenda_paciente?: number
	nm_paciente!: string
}
