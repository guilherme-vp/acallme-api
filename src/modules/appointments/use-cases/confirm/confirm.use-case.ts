import { AppointmentRepository } from '@modules/appointments/repositories'
import { formatAppointment } from '@modules/appointments/utils'
import { SchedulesService } from '@modules/schedules/schedules.service'
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common'
import { I18nService } from 'nestjs-i18n'

@Injectable()
export class ConfirmUseCase {
	constructor(
		private readonly appointmentRepository: AppointmentRepository,
		private readonly specialistSchedService: SchedulesService,
		private readonly languageService: I18nService
	) {}

	async execute(specialistId: number, appointmentId: number) {
		const foundAppointment = await this.appointmentRepository.getOneById(appointmentId)

		const formattedAppointment = formatAppointment(foundAppointment)

		const schedule = await this.specialistSchedService.getSpecialistSchedule(specialistId)

		if (schedule.scheduleId !== formattedAppointment.specialistSchedId) {
			throw new UnauthorizedException(
				await this.languageService.translate('schedule.user-not-authorized')
			)
		}

		if (formattedAppointment.confirmed) {
			throw new BadRequestException(
				await this.languageService.translate('schedule.already-confimed')
			)
		}

		await this.appointmentRepository.confirmAppointment(appointmentId)

		return true
	}
}
