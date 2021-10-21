import { Gateways as CommonGateways } from '@common/gateways'
import { Gateways as CallGateways } from '@modules/calls/websockets'
import { Global, Logger, Module } from '@nestjs/common'

import { Repositories } from './repositories'
import { SchedulesService } from './schedules.service'
import { TaskService } from './tasks'
import { UseCases } from './use-cases'

@Global()
@Module({
	providers: [
		...UseCases,
		...Repositories,
		...CommonGateways,
		...CallGateways,
		TaskService,
		SchedulesService,
		Logger
	],
	exports: [...UseCases, SchedulesService, TaskService]
})
export class SchedulesModule {}
