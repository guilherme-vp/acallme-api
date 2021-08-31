import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'

import { CryptService } from './crypt'
import { DatabaseModule } from './database'
import { LanguageModule } from './language'
import { SecurityConfig } from '~main/config'

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
	imports: [jwtModule, LanguageModule, DatabaseModule],
	providers: [CryptService],
	exports: [CryptService, jwtModule, LanguageModule, DatabaseModule]
})
export class ServicesModule {}
