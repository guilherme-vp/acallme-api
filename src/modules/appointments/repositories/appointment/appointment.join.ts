import { Tables } from '@services/database/tables'

export const joinUsers = `
INNER JOIN ${Tables.Schedule} schedule ON appointment.cd_agenda = schedule.cd_agenda
`
