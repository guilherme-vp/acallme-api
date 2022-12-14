import { createParamDecorator, ExecutionContext } from '@nestjs/common'

import { Schedule } from '@modules/schedules/entities'

export const ScheduleWs = createParamDecorator(
	(data: keyof Schedule, context: ExecutionContext) => {
		const request = context.switchToWs().getClient()

		const { schedule } = request

		if (!schedule) {
			return
		}

		return data ? schedule[data] : schedule
	}
)
