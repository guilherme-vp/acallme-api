import { BaseUseCase } from '@common/domain/base'
import { FindManyDto } from '@modules/specialists/dtos'
import { Specialist } from '@modules/specialists/entities'
import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ILike, In, Like, Repository } from 'typeorm'

@Injectable()
export class FindManyUseCase implements BaseUseCase<Specialist> {
	private logger: Logger = new Logger('FindManySpecialty')

	constructor(
		@InjectRepository(Specialist)
		private readonly specialistRepository: Repository<Specialist>
	) {}

	async execute(where: FindManyDto): Promise<{ specialists: Specialist[]; total: number }> {
		const { email, limit = 9, name, page = 1, specialties } = where

		const keys: Partial<Record<keyof Specialist, unknown>> = {}

		if (name) {
			this.logger.log('Adding name query with insensitive case and starts with method')
			keys.name = ILike(`${name}%`)
		}

		if (email) {
			this.logger.log('Adding name query with starts with method')
			keys.email = Like(`${email}%`)
		}

		const whereKeys = {
			...keys,
			specialties: specialties
				? {
					name: In(specialties)
				  }
				: {}
		}

		this.logger.log('Counting specialists count with given where: ', whereKeys)
		const total = await this.specialistRepository.count({
			where: whereKeys,
			cache: true
		})

		this.logger.log(
			'Searching and returning specialists with given limit and page: ',
			limit,
			page
		)
		const foundSpecialists = await this.specialistRepository.find({
			cache: true,
			loadEagerRelations: true,
			order: {
				name: 'ASC'
			},
			take: +limit,
			skip: (+page - 1) * +limit,
			where: whereKeys
		})

		return {
			specialists: foundSpecialists,
			total
		}
	}
}
