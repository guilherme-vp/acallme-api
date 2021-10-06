import {
	NestMiddleware,
	HttpStatus,
	Injectable,
	UnauthorizedException
} from '@nestjs/common'
import { HttpException } from '@nestjs/common/exceptions/http.exception'
import { JwtService } from '@nestjs/jwt'
import { FastifyReply, FastifyRequest, DoneFuncWithErrOrRes } from 'fastify'
import { I18nService } from 'nestjs-i18n'

import { PatientService } from '../patients.service'

@Injectable()
export class AuthMiddleware implements NestMiddleware {
	constructor(
		private readonly patientService: PatientService,
		private readonly jwtService: JwtService,
		private readonly languageService: I18nService
	) {}

	async use(req: FastifyRequest, _res: FastifyReply, done: DoneFuncWithErrOrRes) {
		const authHeaders = req.headers.authorization
		const splitted = (authHeaders as string).split(' ')

		if (!authHeaders && !splitted[1]) {
			throw new HttpException(
				await this.languageService.translate('auth.not-authorized'),
				HttpStatus.UNAUTHORIZED
			)
		}

		const token = splitted[1]

		const decoded = await this.jwtService.verifyAsync(token)

		if (!decoded) {
			throw new UnauthorizedException()
		}

		const user = await this.patientService.findById(decoded.id)

		if (!user) {
			throw new HttpException(
				await this.languageService.translate('auth.user-does-not-exists'),
				HttpStatus.UNAUTHORIZED
			)
		}

		req.user = user.patient

		done()
	}
}
