import { UserToken } from '@domain/base'
// eslint-disable-next-line import/extensions
import { PatientService } from '@modules/patients/patients.service'
import {
	Injectable,
	CanActivate,
	ExecutionContext,
	HttpException,
	HttpStatus
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { I18nService } from 'nestjs-i18n'

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private readonly jwtService: JwtService,
		private readonly languageService: I18nService,
		private readonly patientService: PatientService
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest()

		const authHeader = request.headers['authorization']

		const splitted = (authHeader as string).split(' ')

		if (!authHeader || !splitted[1]) {
			throw new HttpException(
				await this.languageService.translate('auth.not-authorized'),
				HttpStatus.UNAUTHORIZED
			)
		}

		const token = splitted[1]
		const decoded: UserToken = await this.jwtService.verifyAsync(token)

		if (!decoded) {
			throw new HttpException(
				await this.languageService.translate('auth.not-authorized'),
				HttpStatus.UNAUTHORIZED
			)
		}

		const user = await this.patientService.findById(decoded.id)

		if (!user) {
			throw new HttpException(
				await this.languageService.translate('auth.user-does-not-exists'),
				HttpStatus.UNAUTHORIZED
			)
		}

		request.user = user.patient

		return true
	}
}
