/* eslint-disable indent */
import { Injectable } from '@nestjs/common'

import { BaseUseCase } from '@common/domain/base'

import { FindOneDto } from '@modules/patients/dtos'
import { Patient } from '@modules/patients/entities'

import { PrismaService } from '@services/prisma'

@Injectable()
export class FindOneUseCase implements BaseUseCase<Patient> {
	constructor(private readonly prisma: PrismaService) {}

	async execute(where: FindOneDto, method: 'AND' | 'OR' = 'OR'): Promise<Patient | null> {
		const foundPatient = await this.prisma.patient.findFirst({
			where:
				method === 'OR'
					? {
							OR: where
					  }
					: {
							AND: where
					  }
		})

		return foundPatient
	}
}
