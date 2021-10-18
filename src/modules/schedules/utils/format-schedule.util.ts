import { ScheduleFormatted, ScheduleModel } from '../entities'

export function formatSchedule(data: ScheduleModel): ScheduleFormatted {
	const {
		CD_AGENDA: scheduleId,
		CD_CHAMADA: appointmentId,
		CD_ESPECIALISTA: specialistId,
		CD_PACIENTE: patientId,
		DT_FIM_RANGE: rangeEnd,
		DT_INI_RANGE: rangeStart,
		VL_CONFIRMADO: confirmed
	} = data

	const formatted: ScheduleFormatted = {
		appointmentId,
		scheduleId,
		patientId,
		specialistId,
		rangeStart,
		rangeEnd,
		confirmed: Boolean(confirmed)
	}

	return formatted
}
