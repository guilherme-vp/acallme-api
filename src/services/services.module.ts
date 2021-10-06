import { SecurityConfig } from '@core/config'
import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { ScheduleModule } from '@nestjs/schedule'

import { CryptService } from './crypt'
import { DatabaseService } from './database'
import { LanguageModule } from './language'
import { TasksModule } from './tasks'

const jwtModule = JwtModule.registerAsync({
	useFactory: async (configService: ConfigService) => {
		const securityConfig = configService.get<SecurityConfig>('security')
		return {
			secret: securityConfig?.secret,
			signOptions: {
				expiresIn: securityConfig?.expiresIn
			}
		}
	},
	imports: [ConfigModule],
	inject: [ConfigService]
})

@Global()
@Module({
	imports: [jwtModule, LanguageModule, ScheduleModule.forRoot(), TasksModule],
	providers: [CryptService, DatabaseService],
	exports: [CryptService, DatabaseService, jwtModule, LanguageModule]
})
export class ServicesModule {}
