import { BaseUseCase } from '@common/domain/base'
import { RequireAtLeastOne } from '@core/types/require-at-least-one'
import { FindManyDto } from '@modules/specialists/dtos'
import { SpecialistFormatted, SpecialistModel } from '@modules/specialists/entities'
import { SpecialistRepository } from '@modules/specialists/repositories'
import { BadRequestException, Injectable } from '@nestjs/common'
import { I18nService } from 'nestjs-i18n'

@Injectable()
export class FindManyUseCase implements BaseUseCase<SpecialistModel> {
	constructor(
		private readonly specialistRepository: SpecialistRepository,
		private readonly languageService: I18nService
	) {}

	async execute(where: FindManyDto): Promise<{ specialist: SpecialistFormatted } | null> {
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

		const foundSpecialist = await this.specialistRepository.getOne(keys, 'OR')

		if (!foundSpecialist) {
			return null
		}

		return {
			specialist: foundSpecialist
		}
	}
}
