import { Role } from '@common/domain/enums'
import { CallService } from '@modules/calls/calls.service'
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
export class CallGuard implements CanActivate {
	constructor(
		private readonly scheduleService: SchedulesService,
		private readonly callService: CallService,
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

		const { callId } = params as { callId: string }

		const foundCall = await this.callService.findById(+callId)

		if (!foundCall || incomingSchedule.id !== foundCall.scheduleId) {
			throw new BadRequestException(
				await this.languageService.translate('schedule.user-not-authorized')
			)
		}

		return true
	}
}
