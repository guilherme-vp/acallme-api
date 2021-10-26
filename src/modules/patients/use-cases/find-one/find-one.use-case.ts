import { BaseUseCase } from '@common/domain/base'
import { splitCpf } from '@common/utils'
import { FindOneDto } from '@modules/patients/dtos'
import { Patient } from '@modules/patients/entities'
import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class FindOneUseCase implements BaseUseCase<Patient> {
	private logger: Logger = new Logger('FindOnePatient')

	constructor(
		@InjectRepository(Patient)
		private readonly patientRepository: Repository<Patient>
	) {}

	async execute(where: FindOneDto, method: 'AND' | 'OR' = 'OR'): Promise<Patient | null> {
		this.logger.log('Splitting all custom fields')
		const { cpf, ...otherFields } = where

		this.logger.log('Creating key object with other fields')
		const keys: Partial<Patient> = otherFields

		if (cpf) {
			this.logger.log('Splitting cpf and saving it to keys object')
			const [full] = splitCpf(cpf)

			keys.cpf = +full
		}

		let foundPatient: Patient | undefined

		if (method === 'OR') {
			const finalWhere: Array<Record<string, unknown>> = []

			this.logger.log('Pushing each key to wheres array')
			Object.entries(keys).map(([key, value]) =>
				finalWhere.push({ [key as keyof Patient]: value })
			)

			this.logger.log('Finding one patient with where values and method OR')
			foundPatient = await this.patientRepository.findOne({ where: finalWhere })
		} else {
			this.logger.log('Finding one patient with where values and method AND')
			foundPatient = await this.patientRepository.findOne({ where: keys })
		}

		if (!foundPatient) {
			this.logger.log('Returning null because no patient was found')
			return null
		}

		return foundPatient
	}
}
