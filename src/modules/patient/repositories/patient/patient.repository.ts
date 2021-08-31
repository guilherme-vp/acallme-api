import { Injectable } from '@nestjs/common'

import { PatientModel } from '~domain/models'
import { DatabaseService } from '~services/database'

@Injectable()
export class PatientRepository {
	constructor(private readonly databaseService: DatabaseService) {}

	async create(data: Omit<PatientModel, 'id' | 'createdAt' | 'updatedAt'>): Promise<PatientModel> {
		return this.databaseService.patient.create({
			data
		}) as unknown as PatientModel
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
