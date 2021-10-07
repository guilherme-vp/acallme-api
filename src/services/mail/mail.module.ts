import { MailerConfig } from '@common/config'
import { MailerModule as NestMailerModule } from '@nestjs-modules/mailer'
import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { MailerService } from './mail.service'

const mailerModule = NestMailerModule.forRootAsync({
	imports: [ConfigModule],
	inject: [ConfigService],
	useFactory: async (configService: ConfigService) => {
		const mailerConfig = configService.get<MailerConfig>('mailer')
		return {
			transport: mailerConfig?.transport,
			defaults: mailerConfig?.defaults,
			preview: mailerConfig?.preview ?? false
		}
	}
})

@Global()
@Module({
	imports: [mailerModule],
	providers: [MailerService],
	exports: [mailerModule, MailerService]
})
export class MailerModule {}
