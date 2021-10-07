import { MailerConfig } from '@core/config'
import { MailerModule as NestMailerModule } from '@nestjs-modules/mailer'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Module({
	imports: [
		NestMailerModule.forRootAsync({
			useFactory: async (configService: ConfigService) => {
				const mailerConfig = configService.get<MailerConfig>('mailer')
				return {
					transport: mailerConfig?.transport,
					defaults: mailerConfig?.defaults,
					preview: mailerConfig?.preview ?? false
				}
			}
		})
	]
})
export class MailerModule {}
