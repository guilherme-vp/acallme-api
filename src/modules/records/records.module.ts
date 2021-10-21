import { Global, Module } from '@nestjs/common'
import { ServicesModule } from '@services/services.module'

import { RecordsController } from './records.controller'
import { RecordService } from './records.service'
import { RecordRepository } from './repositories'
import { UseCases } from './use-cases'

@Global()
@Module({
	imports: [ServicesModule],
	controllers: [RecordsController],
	providers: [...UseCases, RecordService, RecordRepository],
	exports: [RecordService]
})
export class RecordsModule {}
