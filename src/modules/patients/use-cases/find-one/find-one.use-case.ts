import { BaseUseCase } from '@common/domain/base'
import { RequireAtLeastOne } from '@core/types/'
import { PatientFormatted, PatientModel } from '@modules/patients/entities'
import { PatientRepository } from '@modules/patients/repositories'
import { formatPatient } from '@modules/patients/utils'
import { Injectable } from '@nestjs/common'

@Injectable()
export class FindOneUseCase implements BaseUseCase<PatientModel> {
	constructor(private readonly patientRepository: PatientRepository) {}

	async execute(
		fields: RequireAtLeastOne<PatientModel>
	): Promise<{ patient: PatientFormatted } | null> {
		const foundPatient = await this.patientRepository.getOne(fields, 'OR')

		if (!foundPatient) {
			return null
		}

		const patient = formatPatient(foundPatient)

		return {
			patient
		}
	}
}
