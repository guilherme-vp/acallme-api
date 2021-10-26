import { SECRET } from '@common/constants/configuration'
import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { WsException } from '@nestjs/websockets'
import jwt from 'jsonwebtoken'
import { Socket } from 'socket.io'

import { Specialist } from '../entities'

export const SpecialistWs = createParamDecorator(
	(data: keyof Specialist, context: ExecutionContext) => {
		try {
			const request = context.switchToWs().getClient() as Socket

			const { auth, headers } = request.handshake

			if (auth) {
				return data ? auth[data] : auth
			}

			const token = headers.authorization?.split(' ')

			if (token && token[1]) {
				const decoded: any = jwt.verify(token[1], SECRET)
				return data ? decoded[data] : decoded.user
			}
		} catch (e) {
			throw new WsException('Invalid or expired token')
		}
	}
)
