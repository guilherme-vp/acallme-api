import { SecurityConfig } from '@common/config'
import { CacheModule, Global, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { ScheduleModule } from '@nestjs/schedule'

import { CryptService } from './crypt'
import { DatabaseService } from './database'
import { LanguageModule } from './language'
import { MailerModule } from './mail'

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
	inject: [ConfigService]
})

const cacheModule = CacheModule.registerAsync({
	useFactory: async (configService: ConfigService) => {
		const securityConfig = configService.get<SecurityConfig>('security')
		return {
			ttl: securityConfig?.expiresIn
		}
	},
	inject: [ConfigService]
})

@Global()
@Module({
	imports: [jwtModule, cacheModule, LanguageModule, ScheduleModule.forRoot(), MailerModule],
	providers: [CryptService, DatabaseService],
	exports: [
		CryptService,
		DatabaseService,
		jwtModule,
		cacheModule,
		LanguageModule,
		MailerModule
	]
})
export class ServicesModule {}
