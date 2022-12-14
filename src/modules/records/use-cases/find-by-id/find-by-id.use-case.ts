import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { I18nService } from 'nestjs-i18n'

import { Record } from '@modules/records/entities'

import { PrismaService } from '@services/prisma'

@Injectable()
export class FindByIdUseCase {
	private logger = new Logger()

	constructor(
		private readonly prisma: PrismaService,
		private readonly languageService: I18nService
	) {}

	async execute(recordId: number): Promise<Record | null> {
		const record = await this.prisma.record.findUnique({ where: { id: recordId } })

		if (!record) {
			this.logger.error('Throwing because no record was found')
			throw new NotFoundException(await this.languageService.translate('record.dont-exist'))
		}

		return record
	}
}
