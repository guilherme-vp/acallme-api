import { SECRET, mailConfig, PORT, dbConfig } from '@common/constants/configuration'
import { MailerOptions } from '@nestjs-modules/mailer'

export interface AppConfig {
	nest: NestConfig
	security: SecurityConfig
	database: DatabaseConfig
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

export interface DatabaseConfig {
	username: string
	password: string
	uri?: string
}

export type MailerConfig = MailerOptions

const config: AppConfig = {
	nest: {
		port: +(PORT as string) ?? 5005
	},
	security: {
		expiresIn: '1d',
		refreshIn: '7d',
		secret: SECRET
	},
	database: {
		password: dbConfig.password as string,
		username: dbConfig.user as string
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
