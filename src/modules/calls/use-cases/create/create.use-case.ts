import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import { I18nService } from 'nestjs-i18n'

import { CreateDto } from '@modules/calls/dtos'
import { Call } from '@modules/calls/entities'
import { SchedulesService } from '@modules/schedules/schedules.service'

import { PrismaService } from '@services/prisma'

@Injectable()
export class CreateUseCase {
	private logger: Logger = new Logger('CreateCall')

	constructor(
		private readonly scheduleService: SchedulesService,
		private readonly languageService: I18nService,
		private readonly prismaService: PrismaService
	) {}

	async execute(input: CreateDto): Promise<Call> {
		const { scheduleId, duration, rating } = input

		this.logger.log('Finding schedule with given Id')
		const foundSchedule = await this.scheduleService.getById(scheduleId)

		if (!foundSchedule) {
			this.logger.error('Throwing because schedule do not exists')
			throw new BadRequestException(
				await this.languageService.translate('schedule.dont-exist')
			)
		}

		this.logger.log('Inserting call and returning it')
		const createdCall = await this.prismaService.call.create({
			data: {
				scheduleId,
				duration,
				rating
			}
		})

		return createdCall
	}
}
