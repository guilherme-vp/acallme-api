import { BaseUseCase } from '@common/domain/base'
import { Patient } from '@modules/patients/entities'
import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { PrismaService } from '@services/prisma'
import { I18nService } from 'nestjs-i18n'

@Injectable()
export class FindByIdUseCase implements BaseUseCase<Patient> {
	private logger: Logger = new Logger('FindPatientById')

	constructor(
		private readonly languageService: I18nService,
		private readonly prisma: PrismaService
	) {}

	async execute(
		id: number,
		select?: Record<keyof Patient, boolean>
	): Promise<Patient | null> {
		this.logger.log('Searching for patient with given id')
		const foundPatient = await this.prisma.patient.findUnique({
			where: { id },
			select: { password: false, ...select }
		})

		if (!foundPatient) {
			this.logger.log('Throwing because no patient was found')
			throw new NotFoundException(
				await this.languageService.translate('patient.patient-not-found')
			)
		}

		const { password, ...patientWithoutPassword } = foundPatient as Patient

		return patientWithoutPassword
	}
}
