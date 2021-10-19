import { CallFormatted } from '@modules/calls/entities'
import { CallRepository } from '@modules/calls/repositories'
import { Injectable } from '@nestjs/common'

@Injectable()
export class FindByIdUseCase {
	constructor(private readonly callRepository: CallRepository) {}

	async execute(callId: number): Promise<CallFormatted | null> {
		const call = await this.callRepository.getOneById(callId)

		if (!call) {
			return null
		}

		return call
	}
}
