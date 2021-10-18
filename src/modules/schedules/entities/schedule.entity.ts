export interface ScheduleModel {
	CD_AGENDA: number
	CD_CHAMADA: number
	CD_ESPECIALISTA: number
	CD_PACIENTE?: number
	DT_INI_RANGE: Date
	DT_FIM_RANGE: Date
	VL_CONFIRMADO?: number
}
