import { Role } from '@domain/enums'
import { ScheduleFormatted } from '@modules/schedules/entities'
import {
	PatientScheduleRepository,
	SpecialistScheduleRepository
} from '@modules/schedules/repositories'
import { formatSchedule } from '@modules/schedules/utils'
import { Injectable } from '@nestjs/common'

@Injectable()
export class CreateUseCase {
	constructor(
		private readonly patientSchedRepository: PatientScheduleRepository,
		private readonly specialistSchedRepository: SpecialistScheduleRepository
	) {}

	async execute(userId: number, role: Role): Promise<ScheduleFormatted> {
		if (role === Role.Patient) {
			const schedule = await this.patientSchedRepository.create({ CD_PACIENTE: userId })

			const finalSchedule = formatSchedule(schedule)

			return finalSchedule
		}

		const schedule = await this.specialistSchedRepository.create({
			CD_SPECIALIST: userId
		})

		const finalSchedule = formatSchedule(schedule)

		return finalSchedule
	}
}
