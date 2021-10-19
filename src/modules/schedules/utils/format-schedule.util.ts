import { ScheduleFormatted, ScheduleModel } from '../entities'

export function formatSchedule(data: ScheduleModel): ScheduleFormatted {
	const {
		CD_AGENDA: id,
		CD_CHAMADA: appointmentId,
		CD_ESPECIALISTA: specialistId,
		CD_PACIENTE: patientId,
		DT_FIM_RANGE: rangeEnd,
		DT_INI_RANGE: rangeStart,
		VL_CONFIRMADO: confirmed,
		NR_DESABILITADO: disabled
	} = data

	const formatted: ScheduleFormatted = {
		id,
		appointmentId,
		patientId,
		specialistId,
		rangeStart,
		rangeEnd,
		confirmed: Boolean(confirmed),
		disabled: Boolean(disabled)
	}

	return formatted
}
