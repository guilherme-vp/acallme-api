import { config } from '@common/config'
import { ServicesModule } from '@core/services'
import { PatientsModule } from '@modules/patients/patients.module'
import { SchedulesModule } from '@modules/schedules/schedules.module'
import { SpecialistsModule } from '@modules/specialists/specialists.module'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

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
