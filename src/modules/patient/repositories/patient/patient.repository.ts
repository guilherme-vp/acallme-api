import { Injectable } from '@nestjs/common'

import { DatabaseService } from '~services/database'

@Injectable()
export class PatientRepository {
	constructor(private readonly databaseService: DatabaseService) {}

	async getMany() {
		return this.databaseService.patient.findMany()
	}

	async existsEmailCpf(fields: { email: string; cpf: string }) {
		return this.databaseService.patient.count({
			where: fields
		})
	}
}
