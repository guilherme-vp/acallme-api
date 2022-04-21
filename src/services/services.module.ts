import { SecurityConfig } from '@common/config'
import { Global, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { ScheduleModule } from '@nestjs/schedule'

import { CryptService } from './crypt'
import { LanguageModule } from './language'
import { MailerModule } from './mail'
import { PrismaModule } from './prisma'

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

@Global()
@Module({
	imports: [
		jwtModule,
		LanguageModule,
		ScheduleModule.forRoot(),
		MailerModule,
		PrismaModule
	],
	providers: [CryptService],
	exports: [CryptService, jwtModule, PrismaModule]
})
export class ServicesModule {}
