import { BaseUseCase } from '@common/domain/base'
import { RequireAtLeastOne } from '@core/types/'
import { SpecialistFormatted, SpecialistModel } from '@modules/specialists/entities'
import { SpecialistRepository } from '@modules/specialists/repositories'
import { formatSpecialist } from '@modules/specialists/utils'
import { Injectable } from '@nestjs/common'

@Injectable()
export class FindOneUseCase implements BaseUseCase<SpecialistModel> {
	constructor(private readonly specialistRepository: SpecialistRepository) {}

	async execute(
		fields: RequireAtLeastOne<SpecialistModel>
	): Promise<{ specialist: SpecialistFormatted } | null> {
		const foundSpecialist = await this.specialistRepository.getOne(fields, 'OR')

		if (!foundSpecialist) {
			return null
		}

		const specialist = formatSpecialist(foundSpecialist)

		return {
			specialist
		}
	}
}
