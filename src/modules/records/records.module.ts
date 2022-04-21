import { CallService } from '@modules/calls/calls.service'
import { Global, Module } from '@nestjs/common'

import { RecordsController } from './records.controller'
import { RecordService } from './records.service'
import { UseCases } from './use-cases'

@Global()
@Module({
	controllers: [RecordsController],
	providers: [...UseCases, RecordService, CallService],
	exports: [RecordService]
})
export class RecordsModule {}
