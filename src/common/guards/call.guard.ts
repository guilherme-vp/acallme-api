import {
	Injectable,
	CanActivate,
	ExecutionContext,
	BadRequestException,
	Logger
} from '@nestjs/common'
import { I18nService } from 'nestjs-i18n'

import { SchedulesService } from '@modules/schedules/schedules.service'

@Injectable()
export class CallGuard implements CanActivate {
	private logger = new Logger('CallGuard')

	constructor(
		private readonly scheduleService: SchedulesService,
		private readonly languageService: I18nService
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const { user, params } = context.switchToHttp().getRequest()

		if (!params.id) {
			this.logger.log('No schedule id provided')
			throw new BadRequestException(
				await this.languageService.translate('schedule.no-schedule-id')
			)
		}

		const { id: scheduleId } = params as { id: string }

		const foundSchedule = await this.scheduleService.getById(+scheduleId)

		if (!foundSchedule) {
			this.logger.log('No schedule found')
			throw new BadRequestException(
				await this.languageService.translate('schedule.user-not-authorized')
			)
		}

		if (foundSchedule.specialistId !== user.id && foundSchedule.patientId !== user.id) {
			this.logger.log('User not authorized')
			throw new BadRequestException(
				await this.languageService.translate('schedule.user-not-authorized')
			)
		}

		return true
	}
}
