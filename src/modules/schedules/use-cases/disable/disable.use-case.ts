import { NotificationGateway } from '@common/gateways'
import { ScheduleRepository } from '@modules/schedules/repositories'
import { BadRequestException, Injectable } from '@nestjs/common'
import { I18nService } from 'nestjs-i18n'

import { DisableDto } from '../../dtos'

@Injectable()
export class DisableUseCase {
	constructor(
		private readonly scheduleRepository: ScheduleRepository,
		private readonly notificationGateway: NotificationGateway,
		private readonly languageService: I18nService
	) {}

	async execute(data: DisableDto, specialistId: number): Promise<boolean> {
		const { dateEnd, dateStart } = data
		const rangeStart = new Date(dateStart)
		const rangeEnd = new Date(dateEnd)

		const scheduleExist = await this.scheduleRepository.getOne({
			CD_ESPECIALISTA: specialistId,
			DT_INI_RANGE: rangeStart
		})

		if (scheduleExist && scheduleExist.confirmed) {
			throw new BadRequestException(
				await this.languageService.translate('schedule.cant-disable-confirmed')
			)
		}

		if (!scheduleExist) {
			await this.scheduleRepository.create({
				CD_ESPECIALISTA: specialistId,
				DT_INI_RANGE: rangeStart,
				DT_FIM_RANGE: rangeEnd,
				NR_DESABILITADO: 1
			})
		} else {
			const { id } = scheduleExist

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

			this.notificationGateway.sendAppointmentConfirmation(updatedSchedule)
		}

		return true
	}
}
