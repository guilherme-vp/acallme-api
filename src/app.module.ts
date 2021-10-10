import { config } from '@common/config'
import { AppointmentsModule } from '@modules/appointments/appointments.module'
import { PatientsModule } from '@modules/patients/patients.module'
import { SchedulesModule } from '@modules/schedules/schedules.module'
import { SpecialistsModule } from '@modules/specialists/specialists.module'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ServicesModule } from '@services/services.module'

@Module({
	imports: [
		ServicesModule,
		PatientsModule,
		SpecialistsModule,
		SchedulesModule,
		AppointmentsModule,
		ConfigModule.forRoot({ isGlobal: true, load: [config] })
	]
})
export class AppModule {}
