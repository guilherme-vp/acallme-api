import { CreateDto } from '@modules/schedules/dtos'
import { Schedule } from '@modules/schedules/entities'
import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { differenceInHours, startOfHour } from 'date-fns'
import { I18nService } from 'nestjs-i18n'
import { Repository } from 'typeorm'

@Injectable()
export class CreateUseCase {
	private logger: Logger = new Logger('CreateSchedule')

	constructor(
		private readonly languageService: I18nService,
		@InjectRepository(Schedule) private readonly scheduleRepository: Repository<Schedule>
	) {}

	async execute(data: CreateDto, patientId: number): Promise<Schedule> {
		const { dateEnd, dateStart, specialistId } = data
		const rangeStart = startOfHour(new Date(dateStart))
		const rangeEnd = startOfHour(new Date(dateEnd))

		const now = new Date()

		this.logger.log('Getting the difference between hours and date', rangeStart, rangeEnd)
		if (differenceInHours(new Date(dateStart), now) < 1) {
			throw new BadRequestException(
				await this.languageService.translate('schedule.date-not-valid')
			)
		}

		this.logger.log('Checking if schedules exists at the same time')
		const scheduleExist = await this.scheduleRepository.findOne({
			where: { rangeStart, rangeEnd }
		})

		if (scheduleExist) {
			this.logger.log('Schedule date is not valid')
			throw new BadRequestException(
				await this.languageService.translate('schedule.date-not-valid')
			)
		}

		this.logger.log('Creating the schedule with confirmed value as false')
		const createdSchedule = await this.scheduleRepository.save({
			disabled: 1,
			confirmed: 0,
			patientId,
			specialistId,
			rangeStart,
			rangeEnd
		})

		this.logger.log('Returning created schedule')
		return createdSchedule
	}
}
