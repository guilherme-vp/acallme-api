import {
	ScheduleFormatted,
	PatientScheduleModel,
	SpecialistScheduleModel
} from '../entities'

export function formatSchedule(
	data: Partial<PatientScheduleModel & SpecialistScheduleModel>
): ScheduleFormatted {
	const finalData: Partial<ScheduleFormatted> = {}

	if (data.CD_PACIENTE && data.CD_AGENDA_PACIENTE) {
		finalData.userId = +data.CD_PACIENTE
		finalData.scheduleId = +data.CD_AGENDA_PACIENTE
	} else if (data.CD_SPECIALIST && data.CD_AGENDA_SPECIALIST) {
		finalData.userId = +data.CD_SPECIALIST
		finalData.scheduleId = +data.CD_AGENDA_SPECIALIST
	}

	return finalData as ScheduleFormatted
}
