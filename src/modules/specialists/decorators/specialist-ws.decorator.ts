import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Socket } from 'socket.io'

import { Specialist } from '../entities'

export const SpecialistWs = createParamDecorator(
	(data: keyof Specialist, context: ExecutionContext) => {
		const request = context.switchToWs().getClient() as Socket

		const { auth } = request.handshake

		if (auth) {
			return data ? auth[data] : auth
		}
	}
)
