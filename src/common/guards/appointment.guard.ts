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

		let incomingSchedule: ScheduleFormatted

		if (user.role === Role.Patient) {
			incomingSchedule = await this.scheduleService.getPatientSchedule(user.id as number)
		} else {
			incomingSchedule = await this.scheduleService.getSpecialistSchedule(user.id as number)
		}

		const { appointmentId } = params as { appointmentId: string }

		const foundAppointment = await this.appointmentService.findById(+appointmentId)

		if (
			user.role === Role.Patient &&
			incomingSchedule.scheduleId !== foundAppointment?.patientSchedId
		) {
			throw new BadRequestException(
				await this.languageService.translate('schedule.user-not-authorized')
			)
		}

		if (
			user.role === Role.Specialist &&
			incomingSchedule.scheduleId !== foundAppointment?.specialistSchedId
		) {
			throw new BadRequestException(
				await this.languageService.translate('schedule.user-not-authorized')
			)
		}

		return true
	}
}
