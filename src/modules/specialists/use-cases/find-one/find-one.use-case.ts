import { BaseUseCase } from '@common/domain/base'
import { RequireAtLeastOne } from '@core/types/require-at-least-one'
import { FindOneDto } from '@modules/specialists/dtos'
import { SpecialistFormatted, SpecialistModel } from '@modules/specialists/entities'
import { SpecialistRepository } from '@modules/specialists/repositories'
import { BadRequestException, Injectable } from '@nestjs/common'
import { I18nService } from 'nestjs-i18n'

@Injectable()
export class FindOneUseCase implements BaseUseCase<SpecialistModel> {
	constructor(
		private readonly specialistRepository: SpecialistRepository,
		private readonly languageService: I18nService
	) {}

	async execute(where: FindOneDto): Promise<SpecialistFormatted | null> {
		const keys: RequireAtLeastOne<SpecialistModel> | undefined = undefined

		if (where.email) {
			keys!.DS_EMAIL = where.email
		}
		if (where.name) {
			keys!.NM_ESPECIALISTA = where.name
		}
		if (where.cnpj) {
			const full = where.cnpj.substring(0, 12)

			keys!.NR_CNPJ = +full
		}
		if (where.cpf) {
			const full = where.cpf.substring(0, 9)

			keys!.NR_CPF = +full
		}
		if (where.crm) {
			keys!.NR_CRM = +where.crm
		}
		if (where.crp) {
			keys!.NR_CRP = +where.crp
		}

		if (!keys) {
			throw new BadRequestException(await this.languageService.translate('no-field'))
		}

		const foundSpecialist = await this.specialistRepository.getOne(keys, 'OR')

		if (!foundSpecialist) {
			return null
		}

		return foundSpecialist
	}
}
