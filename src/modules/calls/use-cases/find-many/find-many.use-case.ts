import { Call } from '@modules/calls/entities'
import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { FindManyDto } from '../../dtos'

@Injectable()
export class FindManyUseCase {
	private logger: Logger = new Logger('FindManyCalls')

	constructor(@InjectRepository(Call) private readonly callRepository: Repository<Call>) {}

	async execute(where?: FindManyDto) {
		this.logger.log('Searching call with given fields')
		const calls = await this.callRepository.find({ where })

		return calls
	}
}
