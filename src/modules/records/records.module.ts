import { Global, Module } from '@nestjs/common'

import { RecordsController } from './records.controller'
import { RecordService } from './records.service'
import { RecordRepository } from './repositories'
import { UseCases } from './use-cases'

@Global()
@Module({
	controllers: [RecordsController],
	providers: [...UseCases, RecordService, RecordRepository],
	exports: [RecordService]
})
export class RecordsModule {}
