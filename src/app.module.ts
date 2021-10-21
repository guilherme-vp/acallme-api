import { config } from '@common/config'
import { CallsModule } from '@modules/calls/calls.module'
import { PatientsModule } from '@modules/patients/patients.module'
import { RecordsModule } from '@modules/records/records.module'
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
		CallsModule,
		RecordsModule,
		ConfigModule.forRoot({ isGlobal: true, load: [config] })
	]
})
export class AppModule {}
