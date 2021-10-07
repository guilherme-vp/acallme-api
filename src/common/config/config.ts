import { SECRET, mailConfig, NODE_ENV } from '@common/constants/configuration'
import { MailerOptions } from '@nestjs-modules/mailer'

export interface AppConfig {
	nest: NestConfig
	security: SecurityConfig
	mailer: MailerConfig
}

export interface NestConfig {
	port: number
}

export interface SecurityConfig {
	expiresIn: string
	refreshIn: string
	secret: string
}

export type MailerConfig = MailerOptions

const config: AppConfig = {
	nest: {
		port: 5005
	},
	security: {
		expiresIn: '1d',
		refreshIn: '7d',
		secret: SECRET
	},
	mailer: {
		transport: mailConfig,
		defaults: {
			from: `"No Reply" <acallme.vortechs@gmail.com>`
		}
		// preview: NODE_ENV !== 'development'
	}
}

export default (): AppConfig => config
