import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { config } from '@common/config'

import { CallsModule } from '@modules/calls/calls.module'
import { NotificationsModule } from '@modules/notifications/notifications.module'
import { PatientsModule } from '@modules/patients/patients.module'
import { RecordsModule } from '@modules/records/records.module'
import { SchedulesModule } from '@modules/schedules/schedules.module'
import { SpecialistsModule } from '@modules/specialists/specialists.module'

import { ServicesModule } from '@services/services.module'

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true, load: [config] }),
		ServicesModule,
		PatientsModule,
		SpecialistsModule,
		SchedulesModule,
		CallsModule,
		RecordsModule,
		NotificationsModule
	]
})
export class AppModule {}
