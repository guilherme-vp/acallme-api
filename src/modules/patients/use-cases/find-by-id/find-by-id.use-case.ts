import { BaseUseCase } from '@common/domain/base'
import { Patient } from '@modules/patients/entities'
import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { I18nService } from 'nestjs-i18n'
import { Repository } from 'typeorm'

@Injectable()
export class FindByIdUseCase implements BaseUseCase<Patient> {
	private logger: Logger = new Logger('FindPatientById')

	constructor(
		@InjectRepository(Patient) private readonly patientRepository: Repository<Patient>,
		private readonly languageService: I18nService
	) {}

	async execute(id: number, select?: (keyof Patient)[]): Promise<Patient | null> {
		this.logger.log('Searching for patient with given id')
		const foundPatient = await this.patientRepository.findOne({ where: { id }, select })

		if (!foundPatient) {
			this.logger.log('Throwing because no patient was found')
			throw new NotFoundException(
				await this.languageService.translate('patient.patient-not-found')
			)
		}

		delete foundPatient.password

		this.logger.log('Deleting and returning patient without password')
		return foundPatient
	}
}
