import { Global, Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { ServicesModule } from '@services/services.module'

import { AppointmentsController } from './appointments.controller'
import { AppointmentService } from './appointments.service'
import { AppointmentRepository } from './repositories'
// import { UseCases } from './use-cases'

@Global()
@Module({
	imports: [ServicesModule, ScheduleModule],
	controllers: [AppointmentsController],
	providers: [AppointmentService, AppointmentRepository],
	exports: [AppointmentService]
})
export class AppointmentsModule {}
