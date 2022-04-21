import { BaseUseCase } from '@common/domain/base'
import { Specialist } from '@modules/specialists/entities'
import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { PrismaService } from '@services/prisma'
import { I18nService } from 'nestjs-i18n'

@Injectable()
export class FindByIdUseCase implements BaseUseCase<Specialist> {
	private logger: Logger = new Logger('FindSpecialtyById')

	constructor(
		private readonly languageService: I18nService,
		private readonly prisma: PrismaService
	) {}

	async execute(
		id: number,
		select?: Record<keyof Specialist, boolean>
	): Promise<Specialist | null> {
		this.logger.log('Finding specialist by given id')
		const foundSpecialist = (await this.prisma.specialist.findUnique({
			where: { id },
			select
		})) as Specialist

		if (!foundSpecialist) {
			this.logger.log('Throwing because no specialist was found')
			throw new NotFoundException(
				await this.languageService.translate('specialist.specialist-not-found')
			)
		}

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password: specialistPassword, ...specialistWithoutPasssword } = foundSpecialist

		this.logger.log('Return specialist')
		return specialistWithoutPasssword
	}
}
