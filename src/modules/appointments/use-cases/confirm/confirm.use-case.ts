import { AppointmentRepository } from '@modules/appointments/repositories'
import { ScheduleRepository } from '@modules/schedules/repositories'
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common'
import { I18nService } from 'nestjs-i18n'

@Injectable()
export class ConfirmUseCase {
	constructor(
		private readonly appointmentRepository: AppointmentRepository,
		private readonly scheduleRepository: ScheduleRepository,
		private readonly languageService: I18nService
	) {}

	async execute(specialistId: number, appointmentId: number) {
		const foundAppointment = await this.appointmentRepository.getOneById(appointmentId)

		const schedule = await this.scheduleRepository.getOne({ CD_ESPECIALISTA: specialistId })

		if (schedule.scheduleId !== foundAppointment.scheduleId) {
			throw new UnauthorizedException(
				await this.languageService.translate('schedule.user-not-authorized')
			)
		}

		if (schedule.confirmed) {
			throw new BadRequestException(
				await this.languageService.translate('schedule.already-confimed')
			)
		}

		await this.appointmentRepository.confirmAppointment(appointmentId)

		return true
	}
}
