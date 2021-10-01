import { SecurityConfig } from '@core/config'
import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'

@Global()
@Module({
	imports: [
		JwtModule.registerAsync({
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
	],
	exports: [TokenModule]
})
export class TokenModule {}
