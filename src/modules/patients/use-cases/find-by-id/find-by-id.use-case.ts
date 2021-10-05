import { BaseUseCase } from '@domain/base'
import { PatientModel } from '@modules/patients/entities'
import { PatientRepository } from '@modules/patients/repositories'
import { Injectable, NotFoundException } from '@nestjs/common'
import { I18nService } from 'nestjs-i18n'

@Injectable()
export class FindByIdUseCase implements BaseUseCase<PatientModel> {
	constructor(
		private readonly patientRepository: PatientRepository,
		private readonly languageService: I18nService
	) {}

	async execute(id: number) {
		const foundPatient = await this.patientRepository.getOneById(id)

		if (!foundPatient) {
			throw new NotFoundException(await this.languageService.translate('auth.user-does-not-exists'))
		}

		return {
			patient: foundPatient
		}
	}
}
