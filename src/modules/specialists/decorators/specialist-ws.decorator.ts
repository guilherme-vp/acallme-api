import { createParamDecorator, ExecutionContext } from '@nestjs/common'

import { Specialist } from '../entities'

export const SpecialistWs = createParamDecorator(
	(data: keyof Specialist, context: ExecutionContext) => {
		const request = context.switchToWs().getClient()

		const { auth } = request.handshake

		if (auth.role !== 'specialist') {
			return null
		}

		if (auth) {
			return data ? auth[data] : auth
		}
	}
)
