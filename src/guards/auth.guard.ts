/* eslint-disable import/extensions */
import { UserToken } from '@domain/base'
import { Role } from '@domain/enums'
import { PatientService } from '@modules/patients/patients.service'
import { SpecialistService } from '@modules/specialists/specialists.service'
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
		private readonly patientService: PatientService,
		private readonly specialistService: SpecialistService
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

		const patient = await this.patientService.findById(decoded.id)
		const specialist = await this.specialistService.findById(decoded.id)

		if (!patient && !specialist) {
			throw new HttpException(
				await this.languageService.translate('auth.user-does-not-exists'),
				HttpStatus.UNAUTHORIZED
			)
		}

		if (patient) {
			request.user = { ...patient.patient, role: Role.Patient }
		}

		if (specialist) {
			request.user = { ...specialist.specialist, role: Role.Specialist }
		}

		return true
	}
}
