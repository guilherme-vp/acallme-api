import { RecordFormatted } from '@modules/record/entities'
import { ScheduleFormatted } from '@modules/schedules/entities'

export interface AppointmentFormatted {
	id: number
	scheduleId: number
	recordId: number
	duration: number
	rating: number
	schedule: ScheduleFormatted
	record: RecordFormatted
}
