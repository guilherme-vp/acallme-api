import { Role } from '@common/domain/enums'
import { PatientService } from '@modules/patients/patients.service'
import { SpecialistService } from '@modules/specialists/specialists.service'
import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common'
import { WsException } from '@nestjs/websockets'
import { I18nService } from 'nestjs-i18n'
import { Socket } from 'socket.io'

@Injectable()
export class WsAuthGuard implements CanActivate {
	private logger: Logger = new Logger('WS-Auth-Guard')

	constructor(
		private readonly languageService: I18nService,
		private readonly patientService: PatientService,
		private readonly specialistService: SpecialistService
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		this.logger.log('Getting user auth')
		const request = context.switchToWs().getClient() as Socket

		if (!request.handshake.auth) {
			throw new WsException(await this.languageService.translate('auth.not-authorized'))
		}

		const decoded = request.handshake.auth

		if (decoded.role === Role.Patient) {
			const patient = await this.patientService.findById(decoded.id)

			if (!patient) {
				this.logger.error('Patient does not exist')
				throw new WsException(
					await this.languageService.translate('auth.user-does-not-exists')
				)
			}

			request.data = { ...patient, role: Role.Patient }
		}

		if (decoded.role === Role.Specialist) {
			const specialist = await this.specialistService.findById(decoded.id)

			if (!specialist) {
				this.logger.error('Specialist is invalid')
				throw new WsException(
					await this.languageService.translate('auth.user-does-not-exists')
				)
			}

			request.data = { ...specialist, role: Role.Specialist }
		}

		return true
	}
}
