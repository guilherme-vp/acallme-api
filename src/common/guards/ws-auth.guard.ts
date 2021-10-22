import { UserToken } from '@common/domain/base'
import { Role } from '@common/domain/enums'
import { PatientService } from '@modules/patients/patients.service'
import { SpecialistService } from '@modules/specialists/specialists.service'
import { CanActivate, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { WsException } from '@nestjs/websockets'
import { I18nService } from 'nestjs-i18n'
import { Socket } from 'socket.io'

@Injectable()
export class WsAuthGuard implements CanActivate {
	constructor(
		private readonly jwtService: JwtService,
		private readonly languageService: I18nService,
		private readonly patientService: PatientService,
		private readonly specialistService: SpecialistService
	) {}

	async canActivate(context: any): Promise<boolean> {
		const request = context.switchToWs().getClient() as Socket

		const authHeader = request.handshake.headers['authorization']

		if (!authHeader) {
			throw new WsException(await this.languageService.translate('auth.not-authorized'))
		}

		const splitted = authHeader.split(' ')

		if (!splitted[1]) {
			throw new WsException(await this.languageService.translate('auth.not-authorized'))
		}

		const token = splitted[1]

		let decoded: UserToken

		try {
			decoded = await this.jwtService.verifyAsync(token)
		} catch {
			throw new WsException(await this.languageService.translate('auth.not-authorized'))
		}

		if (decoded.role === Role.Patient) {
			const patient = await this.patientService.findById(decoded.id)

			if (!patient) {
				throw new WsException(
					await this.languageService.translate('auth.user-does-not-exists')
				)
			}

			request.handshake.auth = { ...patient, role: Role.Patient }
		}

		if (decoded.role === Role.Specialist) {
			const specialist = await this.specialistService.findById(decoded.id)

			if (!specialist) {
				throw new WsException(
					await this.languageService.translate('auth.user-does-not-exists')
				)
			}

			request.handshake.auth = { ...specialist, role: Role.Specialist }
		}

		return true
	}
}
