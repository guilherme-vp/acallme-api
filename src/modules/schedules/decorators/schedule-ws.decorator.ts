import { Schedule } from '@modules/schedules/entities'
import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Socket } from 'socket.io'

export const ScheduleWs = createParamDecorator(
	(data: keyof Schedule, context: ExecutionContext) => {
		const request = context.switchToWs().getClient() as Socket

		const { schedule } = request

		if (!schedule) {
			return
		}

		return data ? schedule[data] : schedule
	}
)
