import { Call } from '@modules/calls/entities'
import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from '@services/prisma'

@Injectable()
export class FindByIdUseCase {
	private logger: Logger = new Logger('FindCallById')

	constructor(private readonly prisma: PrismaService) {}

	async execute(callId: number): Promise<Call | null> {
		this.logger.log('Finding call by given id')
		const call = await this.prisma.call.findFirst({ where: { id: callId } })

		if (!call) {
			this.logger.log('Returning null because no call was found')
			return null
		}

		this.logger.log('Returning found call')
		return call
	}
}
