import { SecurityConfig } from '@core/config'
import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule as NestJwtModule, JwtService } from '@nestjs/jwt'

const jwtModule = NestJwtModule.registerAsync({
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
	imports: [ConfigModule, jwtModule],
	providers: [ConfigService, JwtService],
	exports: [jwtModule]
})
export class JwtModule {}
