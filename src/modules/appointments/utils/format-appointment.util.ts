import { formatPatient } from '@modules/patients/utils'
import { formatSpecialist } from '@modules/specialists/utils'
import * as datefns from 'date-fns'

import { AppointmentFormatted, AppointmentModel } from '../entities'

export function formatAppointment(data: AppointmentModel): AppointmentFormatted {
	const {
		CD_AGENDA_ESPECIALISTA: specialistSchedId,
		CD_AGENDA_PACIENTE: patientSchedId,
		CD_CONSULTA: id,
		DT_CONSULTA: scheduled,
		VL_CONSULTA: cost,
		CD_PRONTUARIO: recordId,
		VL_CONFIRMADO: confirmed,
		P: patient,
		S: specialist
	} = data

	return {
		id,
		cost,
		patientSchedId,
		specialistSchedId,
		scheduled: datefns.formatRelative(scheduled, new Date()),
		confirmed: Boolean(confirmed),
		recordId,
		patient: formatPatient(patient),
		specialist: formatSpecialist(specialist)
	}
}
