import { createParamDecorator, ExecutionContext } from '@nestjs/common'

import { Patient } from '../entities'

export const PatientWs = createParamDecorator(
	(data: keyof Patient, context: ExecutionContext) => {
		const request = context.switchToWs().getClient()

		const { auth } = request.handshake

		if (auth.role !== 'patient') {
			return null
		}

		if (auth) {
			return data ? auth[data] : auth
		}
	}
)
