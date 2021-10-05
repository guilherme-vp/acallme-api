import { config } from '@core/config'
import { ServicesModule } from '@core/services'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { PatientsModule } from './modules/patients/patients.module'

@Module({
	imports: [ServicesModule, PatientsModule, ConfigModule.forRoot({ isGlobal: true, load: [config] })]
})
export class AppModule {}
