import {
	Injectable,
	CanActivate,
	ExecutionContext,
	HttpException,
	HttpStatus,
	Logger
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { I18nService } from 'nestjs-i18n'

import { UserToken } from '@common/domain/base'
import { Role } from '@common/domain/enums'

import { PatientService } from '@modules/patients/patients.service'
import { SpecialistService } from '@modules/specialists/specialists.service'

@Injectable()
export class AuthGuard implements CanActivate {
	private logger: Logger = new Logger('AuthGuard')

	constructor(
		private readonly jwtService: JwtService,
		private readonly languageService: I18nService,
		private readonly patientService: PatientService,
		private readonly specialistService: SpecialistService
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest()

		const authHeader = request.headers.authorization

		if (!authHeader) {
			this.logger.error('No authorization header given')
			throw new HttpException(
				await this.languageService.translate('auth.not-authorized'),
				HttpStatus.UNAUTHORIZED
			)
		}

		const splitted = authHeader.split(' ')

		if (!splitted[1]) {
			this.logger.error('Header not valid or without first word')
			throw new HttpException(
				await this.languageService.translate('auth.not-authorized'),
				HttpStatus.UNAUTHORIZED
			)
		}

		const token = splitted[1]

		let decoded: UserToken

		try {
			decoded = await this.jwtService.verifyAsync(token)
		} catch {
			this.logger.error('Token invalid or expired')
			throw new HttpException(
				await this.languageService.translate('auth.not-authorized'),
				HttpStatus.UNAUTHORIZED
			)
		}

		if (decoded.role === Role.Patient) {
			const patient = await this.patientService.findById(decoded.id)

			if (!patient) {
				this.logger.error('Role patient but user does not exists')
				throw new HttpException(
					await this.languageService.translate('auth.user-does-not-exists'),
					HttpStatus.UNAUTHORIZED
				)
			}

			request.user = { ...patient, role: Role.Patient }
		}

		if (decoded.role === Role.Specialist) {
			const specialist = await this.specialistService.findById(decoded.id)

			if (!specialist) {
				this.logger.error('Role specialist but user does not exists')
				throw new HttpException(
					await this.languageService.translate('auth.user-does-not-exists'),
					HttpStatus.UNAUTHORIZED
				)
			}

			request.user = { ...specialist, role: Role.Specialist }
		}

		return true
	}
}
