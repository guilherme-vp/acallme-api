import { UserModel } from '@common/domain/entities'

export interface PatientModel extends UserModel {
	CD_PACIENTE?: number
	NM_PACIENTE: string
}
