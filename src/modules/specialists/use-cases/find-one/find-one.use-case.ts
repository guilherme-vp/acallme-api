import { BaseUseCase } from '@common/domain/base'
import { splitCnpj, splitCpf } from '@common/utils'
import { FindOneDto } from '@modules/specialists/dtos'
import { Specialist } from '@modules/specialists/entities'
import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class FindOneUseCase implements BaseUseCase<Specialist> {
	private logger: Logger = new Logger('LoginPatient')

	constructor(
		@InjectRepository(Specialist)
		private readonly specialistRepository: Repository<Specialist>
	) {}

	async execute(
		where: FindOneDto,
		method: 'AND' | 'OR' = 'OR'
	): Promise<Specialist | null> {
		this.logger.log('Splitting all custom fields')
		const { cnpj, cpf, crm, crp, ...otherFields } = where

		this.logger.log('Creating key object with other fields')
		const keys: Partial<Specialist> = otherFields

		if (cnpj) {
			this.logger.log('Splitting cnpj and saving it to keys object')
			const [full] = splitCnpj(cnpj)

			keys.cnpj = +full
		}
		if (cpf) {
			this.logger.log('Splitting cpf and saving it to keys object')
			const [full] = splitCpf(cpf)

			keys.cpf = +full
		}
		if (crm) {
			this.logger.log('Parsing crm and saving it to keys object')
			keys.crm = +crm
		}
		if (crp) {
			this.logger.log('Parsing crp and saving it to keys object')
			keys.crp = +crp
		}

		let foundSpecialist: Specialist | undefined

		if (method === 'OR') {
			const finalWhere: Array<Record<string, unknown>> = []

			this.logger.log('Pushing each key to wheres array')
			Object.entries(keys).map(([key, value]) =>
				finalWhere.push({ [key as keyof Specialist]: value })
			)

			this.logger.log('Finding one specialist with where values and method OR')
			foundSpecialist = await this.specialistRepository.findOne({ where: finalWhere })
		} else {
			this.logger.log('Finding one specialist with where values and method AND')
			foundSpecialist = await this.specialistRepository.findOne({ where: keys })
		}

		if (!foundSpecialist) {
			return null
		}

		return foundSpecialist
	}
}
