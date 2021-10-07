import { AppointmentFormatted, AppointmentModel } from '../entities'

export function formatAppointment(data: AppointmentModel): AppointmentFormatted {
	const {
		CD_AGENDA_ESPECIALISTA: specialistSchedId,
		CD_AGENDA_PACIENTE: patientSchedId,
		CD_CONSULTA: id,
		DT_CONSULTA: scheduled,
		VL_CONSULTA: cost,
		CD_PRONTUARIO: recordId,
		VL_CONFIRMADO: confirmed
	} = data

	return {
		id,
		cost,
		patientSchedId,
		specialistSchedId,
		scheduled,
		confirmed: Boolean(confirmed),
		recordId
	}
}
