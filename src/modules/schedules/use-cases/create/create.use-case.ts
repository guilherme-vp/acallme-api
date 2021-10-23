import { CreateDto } from '@modules/schedules/dtos'
import { ScheduleFormatted } from '@modules/schedules/entities'
import { ScheduleRepository } from '@modules/schedules/repositories'
import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import { differenceInHours, startOfHour } from 'date-fns'
import { I18nService } from 'nestjs-i18n'

@Injectable()
export class CreateUseCase {
	private logger: Logger = new Logger()

	constructor(
		private readonly scheduleRepository: ScheduleRepository,
		private readonly languageService: I18nService
	) {}

	async execute(data: CreateDto, patientId: number): Promise<ScheduleFormatted> {
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
		const scheduleExist = await this.scheduleRepository.existsAtTheSameTime(
			rangeStart,
			specialistId
		)

		if (scheduleExist) {
			this.logger.log('Schedule date is not valid')
			throw new BadRequestException(
				await this.languageService.translate('schedule.date-not-valid')
			)
		}

		this.logger.log('Creating the schedule with confirmed value as false')
		const createdSchedule = await this.scheduleRepository.create({
			CD_ESPECIALISTA: specialistId,
			CD_PACIENTE: patientId,
			DT_INI_RANGE: rangeStart,
			DT_FIM_RANGE: rangeEnd,
			VL_CONFIRMADO: 0,
			NR_DESABILITADO: 1
		})

		if (!createdSchedule) {
			throw new BadRequestException()
		}

		return createdSchedule
	}
}
