import { CallService } from '@modules/calls/calls.service'
import { RecordRepository } from '@modules/records/repositories'
import { BadRequestException, Injectable } from '@nestjs/common'
import { I18nService } from 'nestjs-i18n'

import { CreateDto } from '../../dtos'

@Injectable()
export class CreateUseCase {
	constructor(
		private readonly recordRepository: RecordRepository,
		private readonly callService: CallService,
		private readonly languageService: I18nService
	) {}

	async execute(input: CreateDto) {
		const { callId, diagnosis, observation } = input

		const foundCall = await this.callService.findById(callId)

		if (!foundCall) {
			throw new BadRequestException(await this.languageService.translate('call.dont-exist'))
		}

		const createdRecord = await this.recordRepository.create({
			CD_CHAMADA: callId,
			DS_DIAGNOSTICO: diagnosis,
			DS_OBSERVACAO: observation
		})

		return createdRecord
	}
}