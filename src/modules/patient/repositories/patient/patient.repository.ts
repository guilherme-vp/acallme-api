import { Injectable } from '@nestjs/common'

import { PatientModel } from '~modules/patient/graphql/models'
import { DatabaseService } from '~services/database'

@Injectable()
export class PatientRepository {
	constructor(private readonly databaseService: DatabaseService) {}

	async create(data: PatientModel) {
		return this.databaseService.patient.create({
			data
		})
	}

	async getMany() {
		return this.databaseService.patient.findMany()
	}

	async existsEmailCpf(fields: { email: string; cpf: string }) {
		return this.databaseService.patient.count({
			where: fields
		})
	}
}
