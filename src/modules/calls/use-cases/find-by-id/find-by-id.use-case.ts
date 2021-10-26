import { Call } from '@modules/calls/entities'
import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class FindByIdUseCase {
	private logger: Logger = new Logger('FindCallById')

	constructor(@InjectRepository(Call) private readonly callRepository: Repository<Call>) {}

	async execute(callId: number): Promise<Call | null> {
		this.logger.log('Finding call by given id')
		const call = await this.callRepository.findOne({ id: callId })

		if (!call) {
			this.logger.log('Returning null because no call was found')
			return null
		}

		this.logger.log('Returning found call')
		return call
	}
}
