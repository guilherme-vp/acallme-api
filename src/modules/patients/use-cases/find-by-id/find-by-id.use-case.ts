import { BaseUseCase } from '@domain/base'
import { PatientFormatted, PatientModel } from '@modules/patients/entities'
import { PatientRepository } from '@modules/patients/repositories'
import { formatPatient } from '@modules/patients/util'
import { Injectable } from '@nestjs/common'

@Injectable()
export class FindByIdUseCase implements BaseUseCase<PatientModel> {
	constructor(private readonly patientRepository: PatientRepository) {}

	async execute(id: number): Promise<{ patient: PatientFormatted } | null> {
		const foundPatient = await this.patientRepository.getOneById(id)

		if (!foundPatient) {
			return null
		}

		const patient = formatPatient(foundPatient)

		return {
			patient
		}
	}
}
