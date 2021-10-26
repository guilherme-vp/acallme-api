import { Record } from '@modules/records/entities'
import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { I18nService } from 'nestjs-i18n'
import { Repository } from 'typeorm'

@Injectable()
export class FindByIdUseCase {
	private logger = new Logger()

	constructor(
		@InjectRepository(Record) private readonly recordRepository: Repository<Record>,
		private readonly languageService: I18nService
	) {}

	async execute(recordId: number): Promise<Record | null> {
		this.logger.log('Searching for record with given id')
		const record = await this.recordRepository.findOne({ where: { id: recordId } })

		if (!record) {
			this.logger.error('Throwing because no record was found')
			throw new NotFoundException(await this.languageService.translate('record.dont-exist'))
		}

		return record
	}
}
