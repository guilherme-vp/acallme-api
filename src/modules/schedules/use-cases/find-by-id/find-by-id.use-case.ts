import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { I18nService } from 'nestjs-i18n'

import { Schedule } from '@modules/schedules/entities'

import { PrismaService } from '@services/prisma'

@Injectable()
export class FindByIdUseCase {
	private logger: Logger = new Logger('FindScheduleById')

	constructor(
		private readonly languageService: I18nService,
		private readonly prisma: PrismaService
	) {}

	async execute(id: number, select?: Record<keyof Schedule, boolean>): Promise<Schedule> {
		this.logger.log('Searching for schedule with given id')
		const foundSchedule = await this.prisma.schedule.findUnique({ where: { id }, select })

		if (!foundSchedule) {
			this.logger.log('Throwing because no schedule was found')
			throw new NotFoundException(
				await this.languageService.translate('schedule.dont-exist')
			)
		}

		this.logger.log('Returning found schedule')
		return foundSchedule as Schedule
	}
}
