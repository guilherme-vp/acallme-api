import { CallsModule } from '@modules/calls/calls.module'
import { PatientsModule } from '@modules/patients/patients.module'
import { SpecialistsModule } from '@modules/specialists/specialists.module'
import { forwardRef, Global, Logger, Module } from '@nestjs/common'
import { ScheduleModule as NestScheduleModule } from '@nestjs/schedule'
import { ServicesModule } from '@services/services.module'

import { Repositories } from './repositories'
import { SchedulesService } from './schedules.service'
import { TaskService } from './tasks'
import { UseCases } from './use-cases'

@Global()
@Module({
	imports: [
		ServicesModule,
		NestScheduleModule,
		CallsModule,
		forwardRef(() => PatientsModule),
		forwardRef(() => SpecialistsModule)
	],
	providers: [...UseCases, ...Repositories, TaskService, SchedulesService, Logger],
	exports: [...UseCases, SchedulesService, TaskService]
})
export class SchedulesModule {}
