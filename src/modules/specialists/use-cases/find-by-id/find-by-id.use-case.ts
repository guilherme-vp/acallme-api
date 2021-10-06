import { BaseUseCase } from '@domain/base'
import { SpecialistFormatted, SpecialistModel } from '@modules/specialists/entities'
import { SpecialistRepository } from '@modules/specialists/repositories'
import { formatSpecialist } from '@modules/specialists/util'
import { Injectable, NotFoundException } from '@nestjs/common'
import { I18nService } from 'nestjs-i18n'

@Injectable()
export class FindByIdUseCase implements BaseUseCase<SpecialistModel> {
	constructor(
		private readonly specialistRepository: SpecialistRepository,
		private readonly languageService: I18nService
	) {}

	async execute(id: number): Promise<{ specialist: SpecialistFormatted }> {
		const foundSpecialist = await this.specialistRepository.getOneById(id)

		if (!foundSpecialist) {
			throw new NotFoundException(
				await this.languageService.translate('auth.user-does-not-exists')
			)
		}

		const specialist = formatSpecialist(foundSpecialist)

		return {
			specialist
		}
	}
}
