import { BaseUseCase } from '@common/domain/base'
import { Specialist } from '@modules/specialists/entities'
import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { I18nService } from 'nestjs-i18n'
import { Repository } from 'typeorm'

@Injectable()
export class FindByIdUseCase implements BaseUseCase<Specialist> {
	private logger: Logger = new Logger('FindSpecialtyById')

	constructor(
		private readonly languageService: I18nService,
		@InjectRepository(Specialist)
		private readonly specialistRepository: Repository<Specialist>
	) {}

	async execute(id: number, select?: (keyof Specialist)[]): Promise<Specialist | null> {
		this.logger.log('Finding specialist by given id')
		const foundSpecialist = await this.specialistRepository.findOne({
			where: { id },
			select
		})

		if (!foundSpecialist) {
			this.logger.log('Throwing because no specialist was found')
			throw new NotFoundException(
				await this.languageService.translate('specialist.specialist-not-found')
			)
		}

		this.logger.log('Remove specialist password')
		delete foundSpecialist.password

		this.logger.log('Return specialist')
		return foundSpecialist
	}
}
