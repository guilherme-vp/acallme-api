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
		private readonly languageService: I18nService
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const { user, params } = context.switchToHttp().getRequest() as FastifyRequest

		if (!(params as any).id) {
			throw new BadRequestException(
				await this.languageService.translate('schedule.user-not-authorized')
			)
		}

		const { id: scheduleId } = params as { id: string }

		const foundSchedule = await this.scheduleService.getById(+scheduleId)

		if (!foundSchedule) {
			throw new BadRequestException(
				await this.languageService.translate('schedule.user-not-authorized')
			)
		}

		if (foundSchedule.specialistId !== user.id && foundSchedule.patientId !== user.id) {
			throw new BadRequestException(
				await this.languageService.translate('schedule.user-not-authorized')
			)
		}

		return true
	}
}
