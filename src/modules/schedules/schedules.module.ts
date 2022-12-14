import { Global, Logger, Module } from '@nestjs/common'

import { CallsModule } from '@modules/calls/calls.module'
import { CallService } from '@modules/calls/calls.service'
import { NotificationsModule } from '@modules/notifications/notifications.module'

import { SchedulesController } from './schedules.controller'
import { SchedulesService } from './schedules.service'
import { TaskService } from './tasks'
import { UseCases } from './use-cases'

@Global()
@Module({
	imports: [CallsModule, NotificationsModule],
	controllers: [SchedulesController],
	providers: [...UseCases, TaskService, CallService, SchedulesService, Logger],
	exports: [SchedulesService, TaskService]
})
export class SchedulesModule {}
