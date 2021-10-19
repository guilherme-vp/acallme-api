import { Global, Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { ServicesModule } from '@services/services.module'

import { Repositories } from './repositories'
import { SchedulesService } from './schedules.service'
import { TaskService } from './tasks'
import { UseCases } from './use-cases'
import { Gateways } from './websockets'

@Global()
@Module({
	imports: [ServicesModule, ScheduleModule],
	providers: [...UseCases, ...Gateways, ...Repositories, TaskService, SchedulesService],
	exports: [...UseCases, SchedulesService, TaskService]
})
export class SchedulesModule {}
