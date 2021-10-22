import { NotificationGateway } from '@common/gateways'
import { ScheduleRepository } from '@modules/schedules/repositories'
import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import { I18nService } from 'nestjs-i18n'

import { DisableDto } from '../../dtos'

@Injectable()
export class DisableUseCase {
	private logger: Logger = new Logger('DisableScheduleUsecaSE')
	constructor(
		private readonly scheduleRepository: ScheduleRepository,
		private readonly notificationGateway: NotificationGateway,
		private readonly languageService: I18nService
	) {}

	async execute(data: DisableDto, specialistId: number): Promise<boolean> {
		const { dateEnd, dateStart } = data
		const rangeStart = new Date(dateStart)
		const rangeEnd = new Date(dateEnd)

		this.logger.log('Searching for existing schedule')
		const scheduleExist = await this.scheduleRepository.getOne({
			CD_ESPECIALISTA: specialistId,
			DT_INI_RANGE: rangeStart
		})

		if (scheduleExist && scheduleExist.confirmed) {
			this.logger.log('Schedule is already confirmed')
			throw new BadRequestException(
				await this.languageService.translate('schedule.cant-disable-confirmed')
			)
		}

		if (!scheduleExist) {
			this.logger.log('Creating schedule if it does not exist')
			await this.scheduleRepository.create({
				CD_ESPECIALISTA: specialistId,
				DT_INI_RANGE: rangeStart,
				DT_FIM_RANGE: rangeEnd,
				NR_DESABILITADO: 1
			})
		} else {
			const { id } = scheduleExist
			this.logger.log('Updating current schedule if it does not exist')
			const updatedSchedule = await this.scheduleRepository.updateById(id, {
				CD_ESPECIALISTA: specialistId,
				CD_CHAMADA: undefined,
				DT_INI_RANGE: rangeStart,
				DT_FIM_RANGE: rangeEnd,
				NR_DESABILITADO: 1
			})

			if (!updatedSchedule) {
				return false
			}

			this.logger.log('Send appointment notification to patient and specialist')
			this.notificationGateway.sendAppointmentConfirmation(updatedSchedule)
		}

		return true
	}
}
