import { AppointmentFormatted } from '@modules/appointments/entities'

export interface RecordFormatted {
	id: number
	appointmentId: number
	observation?: string
	diagnosis: string
	appointment: AppointmentFormatted
}
