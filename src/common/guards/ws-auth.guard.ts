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

		const splitted = (authHeader as string).split(' ')

		if (!authHeader || !splitted[1]) {
			throw new WsException(await this.languageService.translate('auth.not-authorized'))
		}

		const token = splitted[1]
		const decoded: UserToken = await this.jwtService.verifyAsync(token)

		if (!decoded) {
			throw new WsException(await this.languageService.translate('auth.not-authorized'))
		}

		const patient = await this.patientService.findById(decoded.id)
		const specialist = await this.specialistService.findById(decoded.id)

		if (!patient && !specialist) {
			throw new WsException(
				await this.languageService.translate('auth.user-does-not-exists')
			)
		}

		if (patient) {
			request.handshake.auth = { ...patient.patient, role: Role.Patient }
		}

		if (specialist) {
			request.handshake.auth = { ...specialist.specialist, role: Role.Specialist }
		}

		return true
	}
}
