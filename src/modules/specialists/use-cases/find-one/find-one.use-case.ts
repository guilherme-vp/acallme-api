/* eslint-disable indent */
import { Injectable } from '@nestjs/common'

import { BaseUseCase } from '@common/domain/base'

import { FindOneDto } from '@modules/specialists/dtos'
import { Specialist } from '@modules/specialists/entities'

import { PrismaService } from '@services/prisma'

@Injectable()
export class FindOneUseCase implements BaseUseCase<Specialist> {
	constructor(private readonly prisma: PrismaService) {}

	async execute(
		where: FindOneDto,
		method: 'AND' | 'OR' = 'OR'
	): Promise<Specialist | null> {
		const foundSpecialist = await this.prisma.specialist.findFirst({
			where:
				method === 'OR'
					? {
							OR: where
					  }
					: {
							AND: where
					  }
		})

		return foundSpecialist
	}
}
