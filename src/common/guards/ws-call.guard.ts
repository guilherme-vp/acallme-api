import { Role } from '@common/domain/enums'
import { CallService } from '@modules/calls/calls.service'
import { ScheduleFormatted } from '@modules/schedules/entities'
import { SchedulesService } from '@modules/schedules/schedules.service'
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { WsException } from '@nestjs/websockets'
import { I18nService } from 'nestjs-i18n'
import { Socket } from 'socket.io'

@Injectable()
export class WsCallGuard implements CanActivate {
	constructor(
		private readonly scheduleService: SchedulesService,
		private readonly callService: CallService,
		private readonly languageService: I18nService
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToWs().getClient() as Socket

		const user = request.handshake.auth

		let incomingSchedule: ScheduleFormatted | undefined

		if (user.role === Role.Patient) {
			const foundSchedule = await this.scheduleService.getOne({ patientId: user.id })

			incomingSchedule = foundSchedule?.schedule
		} else {
			const foundSchedule = await this.scheduleService.getOne({ specialistId: user.id })

			incomingSchedule = foundSchedule?.schedule
		}

		if (!user || !incomingSchedule) {
			throw new WsException(
				await this.languageService.translate('schedule.user-not-authorized')
			)
		}

		const { callId } = request.handshake.query as { callId: string }

		const foundCall = await this.callService.findById(+callId)

		if (!foundCall || incomingSchedule.id !== foundCall.scheduleId) {
			throw new WsException(
				await this.languageService.translate('schedule.user-not-authorized')
			)
		}

		return true
	}
}
