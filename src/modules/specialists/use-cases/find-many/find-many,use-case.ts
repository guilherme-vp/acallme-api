import { BaseUseCase } from '@common/domain/base'
import { RequireAtLeastOne } from '@core/types/require-at-least-one'
import { FindManyDto } from '@modules/specialists/dtos'
import { SpecialistFormatted, SpecialistModel } from '@modules/specialists/entities'
import {
	SpecialistRepository,
	SpecialtyRepository
} from '@modules/specialists/repositories'
import { BadRequestException, Injectable } from '@nestjs/common'
import { I18nService } from 'nestjs-i18n'

@Injectable()
export class FindManyUseCase implements BaseUseCase<SpecialistModel> {
	constructor(
		private readonly specialistRepository: SpecialistRepository,
		private readonly specialtyRepository: SpecialtyRepository,
		private readonly languageService: I18nService
	) {}

	async execute(where: FindManyDto): Promise<SpecialistFormatted[]> {
		const keys: RequireAtLeastOne<SpecialistModel> | undefined = undefined

		if (where.email) {
			keys!.DS_EMAIL = where.email
		}
		if (where.name) {
			keys!.NM_ESPECIALISTA = where.name
		}

		if (!keys) {
			throw new BadRequestException(await this.languageService.translate('no-field'))
		}

		let foundSpecialists = await this.specialistRepository.getMany(
			keys,
			'OR',
			where.page,
			where.limit
		)

		if (where.specialties) {
			const foundSpecialties = await this.specialtyRepository.getManyByNames(
				where.specialties
			)

			foundSpecialists = foundSpecialists.filter(({ id }) =>
				foundSpecialties.some(({ specialistId }) => id === specialistId)
			)
		}

		return foundSpecialists
	}
}
