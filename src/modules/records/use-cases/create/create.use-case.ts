import { CallService } from '@modules/calls/calls.service'
import { Record } from '@modules/records/entities'
import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { I18nService } from 'nestjs-i18n'
import { Repository } from 'typeorm'

import { CreateDto } from '../../dtos'

@Injectable()
export class CreateUseCase {
	private logger = new Logger()

	constructor(
		@InjectRepository(Record) private readonly recordRepository: Repository<Record>,
		private readonly callService: CallService,
		private readonly languageService: I18nService
	) {}

	async execute(input: CreateDto): Promise<Record> {
		const { callId, diagnosis, observation } = input

		this.logger.log('Finding call by id')
		const foundCall = await this.callService.findById(callId)

		if (!foundCall) {
			this.logger.error('Throwing because call does not exist')
			throw new BadRequestException(await this.languageService.translate('call.dont-exist'))
		}

		this.logger.log('Creating record with given call id')
		const createdRecord = await this.recordRepository.save({
			callId,
			diagnosis,
			observation
		})

		return createdRecord
	}
}
