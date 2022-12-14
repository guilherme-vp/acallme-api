import { createParamDecorator, ExecutionContext } from '@nestjs/common'

import { Call } from '@modules/calls/entities'

export const CallWs = createParamDecorator(
	(data: keyof Call, context: ExecutionContext) => {
		const request = context.switchToWs().getClient()

		const { call } = request

		if (!call) {
			return
		}

		return data ? call[data] : call
	}
)
