import { config } from '@core/config'
import { PatientModule } from '@core/modules'
import { ServicesModule } from '@core/services'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

@Module({
	imports: [ServicesModule, PatientModule, ConfigModule.forRoot({ isGlobal: true, load: [config] })]
})
export class AppModule {}
