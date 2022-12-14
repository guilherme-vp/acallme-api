/* eslint-disable indent */
import { Injectable } from '@nestjs/common'

import { FindOneDto } from '@modules/schedules/dtos'
import { Schedule } from '@modules/schedules/entities'

import { PrismaService } from '@services/prisma'

@Injectable()
export class FindOneUseCase {
	constructor(private readonly prisma: PrismaService) {}

	async execute(where: FindOneDto, method: 'AND' | 'OR' = 'OR'): Promise<Schedule | null> {
		const foundSchedule = await this.prisma.schedule.findFirst({
			where:
				method === 'OR'
					? {
							OR: where
					  }
					: {
							AND: where
					  }
		})

		return foundSchedule
	}
}
