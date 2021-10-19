import { BaseUseCase } from '@common/domain/base'
import { PatientFormatted, PatientModel } from '@modules/patients/entities'
import { PatientRepository, PatientSelect } from '@modules/patients/repositories'
import { Injectable } from '@nestjs/common'

@Injectable()
export class FindByIdUseCase implements BaseUseCase<PatientModel> {
	constructor(private readonly patientRepository: PatientRepository) {}

	async execute(id: number, select?: PatientSelect): Promise<PatientFormatted | null> {
		const foundPatient = await this.patientRepository.getOneById(id, select)

		if (!foundPatient) {
			return null
		}

		return foundPatient
	}
}
