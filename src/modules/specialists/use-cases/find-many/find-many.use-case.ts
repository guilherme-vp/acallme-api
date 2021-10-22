import { BaseUseCase } from '@common/domain/base'
import { FindManyDto } from '@modules/specialists/dtos'
import { SpecialistFormatted, SpecialistModel } from '@modules/specialists/entities'
import {
	SpecialistRepository,
	SpecialtyRepository
} from '@modules/specialists/repositories'
import { Injectable } from '@nestjs/common'
import _ from 'lodash'

@Injectable()
export class FindManyUseCase implements BaseUseCase<SpecialistModel> {
	constructor(
		private readonly specialistRepository: SpecialistRepository,
		private readonly specialtyRepository: SpecialtyRepository
	) {}

	async execute(where: FindManyDto): Promise<SpecialistFormatted[]> {
		const keys: Partial<SpecialistModel> = {}

		if (where.email) {
			keys.DS_EMAIL = where.email
		}
		if (where.name) {
			keys.NM_ESPECIALISTA = where.name
		}

		const foundSpecialists = await this.specialistRepository.getMany(
			!_.isEmpty(keys) ? keys : undefined,
			'OR',
			where.page,
			where.limit
		)

		const foundSpecialties = await this.specialtyRepository.getManyByNames(
			where.specialties
		)

		const specialistsWithSpecialties = foundSpecialists
			.filter(({ id }) => foundSpecialties.some(({ specialistId }) => id === specialistId))
			.map(({ id, ...rest }) => {
				const specialties = foundSpecialties.filter(
					({ specialistId }) => specialistId === id
				)

				delete rest.password

				return { id, ...rest, specialties }
			})

		return specialistsWithSpecialties
	}
}
