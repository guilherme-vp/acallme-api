import { CreateDto } from '@modules/schedules/dtos'
import { Schedule } from '@modules/schedules/entities'
import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import { PrismaService } from '@services/prisma'
import { differenceInHours, startOfHour } from 'date-fns'
import { I18nService } from 'nestjs-i18n'

@Injectable()
export class CreateUseCase {
	private logger: Logger = new Logger('CreateSchedule')

	constructor(
		private readonly languageService: I18nService,
		private readonly prisma: PrismaService
	) {}

	async execute(data: CreateDto, patientId: number): Promise<Schedule> {
		const { dateEnd, dateStart, specialistId } = data
		const startsAt = startOfHour(new Date(dateStart))
		const endsAt = startOfHour(new Date(dateEnd))

		const now = new Date()

		if (differenceInHours(new Date(dateStart), now) < 1) {
			throw new BadRequestException(
				await this.languageService.translate('schedule.date-not-valid')
			)
		}

		this.logger.log('Checking if schedules exists at the same time')
		const scheduleExist = await this.prisma.schedule.findFirst({
			where: { startsAt, endsAt }
		})

		if (scheduleExist) {
			this.logger.log('Schedule date is not valid')
			throw new BadRequestException(
				await this.languageService.translate('schedule.date-not-valid')
			)
		}

		this.logger.log('Creating the schedule with confirmed value as false')
		const createdSchedule = await this.prisma.schedule.create({
			data: {
				patientId,
				specialistId,
				startsAt,
				endsAt
			}
		})

		this.logger.log('Returning created schedule')
		return createdSchedule
	}
}
