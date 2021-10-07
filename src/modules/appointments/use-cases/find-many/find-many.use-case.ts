import { RequireAtLeastOne } from '@core/types'
import { AppointmentModel } from '@modules/appointments/entities'
import { AppointmentRepository } from '@modules/appointments/repositories'
import { Injectable } from '@nestjs/common'

@Injectable()
export class FindManyUseCase {
	constructor(private readonly appointmentRepository: AppointmentRepository) {}

	async execute(where?: RequireAtLeastOne<AppointmentModel>) {
		const appointments = await this.appointmentRepository.getMany(where)

		return appointments
	}
}
