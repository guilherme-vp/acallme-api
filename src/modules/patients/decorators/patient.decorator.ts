import { SECRET } from '@common/constants/configuration'
import {
	createParamDecorator,
	ExecutionContext,
	UnauthorizedException
} from '@nestjs/common'
import jwt from 'jsonwebtoken'

export const Patient = createParamDecorator((data: any, ctx: ExecutionContext) => {
	try {
		const req = ctx.switchToHttp().getRequest()

		if (req.user) {
			return data ? req.user[data] : req.user
		}

		const token = req.headers.authorization.split(' ')

		if (token && token[1]) {
			const decoded: any = jwt.verify(token[1], SECRET)
			return data ? decoded[data] : decoded.user
		}
	} catch (e) {
		throw new UnauthorizedException('Invalid or expired token')
	}
})
