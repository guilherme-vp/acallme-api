import { RecordFormatted } from '@modules/records/entities'
import { RecordRepository } from '@modules/records/repositories'
import { Injectable } from '@nestjs/common'

@Injectable()
export class FindByIdUseCase {
	constructor(private readonly recordRepository: RecordRepository) {}

	async execute(recordId: number): Promise<RecordFormatted | null> {
		const record = await this.recordRepository.getOneById(recordId)

		if (!record) {
			return null
		}

		return record
	}
}
