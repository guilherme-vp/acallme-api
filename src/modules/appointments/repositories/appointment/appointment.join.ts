import { Tables } from '@services/database/tables'

export const joinUsers = `
INNER JOIN ${Tables.SchedulePatient} PS ON PS.cd_agenda_paciente = AP.cd_agenda_paciente
INNER JOIN ${Tables.Patient} P ON P.cd_paciente = PS.cd_paciente
INNER JOIN ${Tables.ScheduleSpecialist} SS ON SS.cd_agenda_especialista = AP.cd_agenda_especialista
INNER JOIN ${Tables.Specialist} S ON S.cd_especialista = SS.cd_especialista
`
