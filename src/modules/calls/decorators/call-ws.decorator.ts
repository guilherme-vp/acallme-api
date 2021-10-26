import { Call } from '@modules/calls/entities'
import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Socket } from 'socket.io'

export const CallWs = createParamDecorator(
	(data: keyof Call, context: ExecutionContext) => {
		const request = context.switchToWs().getClient() as Socket

		const { call } = request

		if (!call) {
			return
		}

		return data ? call[data] : call
	}
)
