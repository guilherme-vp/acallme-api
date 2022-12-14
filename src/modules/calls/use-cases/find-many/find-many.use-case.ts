import { Injectable, Logger } from '@nestjs/common'

import { Call } from '@modules/calls/entities'

import { PrismaService } from '@services/prisma'

import { FindManyDto } from '../../dtos'

@Injectable()
export class FindManyUseCase {
	private logger: Logger = new Logger('FindManyCalls')

	constructor(private readonly prisma: PrismaService) {}

	async execute(where?: FindManyDto): Promise<Call[]> {
		this.logger.log('Searching call with given fields')
		const calls = await this.prisma.call.findMany({ where })

		return calls
	}
}
