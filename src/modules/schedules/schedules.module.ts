import { Gateways as CommonGateways } from '@common/gateways'
import { CallsModule } from '@modules/calls/calls.module'
import { CallService } from '@modules/calls/calls.service'
import { Gateways as CallGateways } from '@modules/calls/websockets'
import { Global, Logger, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Schedule } from './entities'
import { SchedulesController } from './schedules.controller'
import { SchedulesService } from './schedules.service'
import { TaskService } from './tasks'
import { UseCases } from './use-cases'

@Global()
@Module({
	imports: [TypeOrmModule.forFeature([Schedule]), CallsModule],
	controllers: [SchedulesController],
	providers: [
		...UseCases,
		...CommonGateways,
		...CallGateways,
		TaskService,
		CallService,
		SchedulesService,
		Logger
	],
	exports: [SchedulesService, TaskService, TypeOrmModule]
})
export class SchedulesModule {}
