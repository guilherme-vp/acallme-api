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
import { WsException } from '@nestjs/websockets'
import { I18nService } from 'nestjs-i18n'
import { Socket } from 'socket.io'

@Injectable()
export class WsAppointmentGuard implements CanActivate {
	constructor(
		private readonly scheduleService: SchedulesService,
		private readonly appointmentService: AppointmentService,
		private readonly languageService: I18nService
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToWs().getClient() as Socket

		const user = request.handshake.auth

		let incomingSchedule: ScheduleFormatted

		if (!user) {
			throw new WsException(
				await this.languageService.translate('schedule.user-not-authorized')
			)
		}

		if (user.role === Role.Patient) {
			incomingSchedule = await this.scheduleService.getPatientSchedule(user.id as number)
		} else {
			incomingSchedule = await this.scheduleService.getSpecialistSchedule(user.id as number)
		}

		const { appointmentId } = request.handshake.query as { appointmentId: string }

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
