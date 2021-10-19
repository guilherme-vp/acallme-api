import { BaseUseCase } from '@common/domain/base'
import { SpecialistFormatted, SpecialistModel } from '@modules/specialists/entities'
import { SpecialistRepository } from '@modules/specialists/repositories'
import { Injectable } from '@nestjs/common'

@Injectable()
export class FindByIdUseCase implements BaseUseCase<SpecialistModel> {
	constructor(private readonly specialistRepository: SpecialistRepository) {}

	async execute(id: number): Promise<SpecialistFormatted | null> {
		const foundSpecialist = await this.specialistRepository.getOneById(id)

		if (!foundSpecialist) {
			return null
		}

		return foundSpecialist
	}
}
