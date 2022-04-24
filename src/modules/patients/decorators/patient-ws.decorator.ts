import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Socket } from 'socket.io'

import { Patient } from '../entities'

export const PatientWs = createParamDecorator(
	(data: keyof Patient, context: ExecutionContext) => {
		const request = context.switchToWs().getClient() as Socket

		const { auth } = request.handshake

		if (auth) {
			return data ? auth[data] : auth
		}
	}
)
