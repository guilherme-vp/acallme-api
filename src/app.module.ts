import { config } from '@core/config'
import { ServicesModule } from '@core/services'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { PatientsModule } from './modules/patients/patients.module'
import { SchedulesModule } from './modules/schedules/schedules.module'
import { SpecialistsModule } from './modules/specialists/specialists.module'

@Module({
	imports: [
		ServicesModule,
		PatientsModule,
		SpecialistsModule,
		SchedulesModule,
		ConfigModule.forRoot({ isGlobal: true, load: [config] })
	]
})
export class AppModule {}
