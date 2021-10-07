import { AppointmentFormatted } from '@modules/appointments/entities'
import { AppointmentRepository } from '@modules/appointments/repositories'
import { formatAppointment } from '@modules/appointments/utils'
import { Injectable } from '@nestjs/common'

@Injectable()
export class FindByIdUseCase {
	constructor(private readonly appointmentRepository: AppointmentRepository) {}

	async execute(appointmentId: number): Promise<AppointmentFormatted | null> {
		const appointment = await this.appointmentRepository.getOneById(appointmentId)

		if (!appointment) {
			return null
		}

		const formattedAppointment = formatAppointment(appointment)

		return formattedAppointment
	}
}
