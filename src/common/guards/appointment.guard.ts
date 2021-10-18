import { Role } from '@common/domain/enums'
import { AppointmentService } from '@modules/appointments/appointments.service'
import { ScheduleFormatted } from '@modules/schedules/entities'
import { SchedulesService } from '@modules/schedules/schedules.service'
import {
	Injectable,
	CanActivate,
	ExecutionContext,
	BadRequestException
} from '@nestjs/common'
import { FastifyRequest } from 'fastify'
import { I18nService } from 'nestjs-i18n'

@Injectable()
export class AppointmentGuard implements CanActivate {
	constructor(
		private readonly scheduleService: SchedulesService,
		private readonly appointmentService: AppointmentService,
		private readonly languageService: I18nService
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const { user, params } = context.switchToHttp().getRequest() as FastifyRequest

		let incomingSchedule: ScheduleFormatted | undefined

		if (user.role === Role.Patient) {
			const foundSchedule = await this.scheduleService.getOne({ patientId: user.id })

			incomingSchedule = foundSchedule?.schedule
		} else {
			const foundSchedule = await this.scheduleService.getOne({ specialistId: user.id })

			incomingSchedule = foundSchedule?.schedule
		}

		if (!user || !incomingSchedule) {
			throw new BadRequestException(
				await this.languageService.translate('schedule.user-not-authorized')
			)
		}

		const { appointmentId } = params as { appointmentId: string }

		const foundAppointment = await this.appointmentService.findById(+appointmentId)

		if (!foundAppointment || incomingSchedule.scheduleId !== foundAppointment.scheduleId) {
			throw new BadRequestException(
				await this.languageService.translate('schedule.user-not-authorized')
			)
		}

		return true
	}
}
