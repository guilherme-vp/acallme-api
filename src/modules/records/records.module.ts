import { CallService } from '@modules/calls/calls.service'
import { Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Record } from './entities'
import { RecordsController } from './records.controller'
import { RecordService } from './records.service'
import { UseCases } from './use-cases'

@Global()
@Module({
	imports: [TypeOrmModule.forFeature([Record])],
	controllers: [RecordsController],
	providers: [...UseCases, RecordService, CallService],
	exports: [RecordService, TypeOrmModule]
})
export class RecordsModule {}
