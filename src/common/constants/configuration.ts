import { MailerOptions } from '@nestjs-modules/mailer'
import { ConnectionAttributes } from 'oracledb'

type Envs = 'development' | 'production'

const {
	NODE_ENV: ProcessEnv,
	DATABASE_USER,
	DATABASE_PASS,
	DATABASE_URI,
	SECRET = 'test123',
	MAIL_HOST,
	MAIL_USER,
	MAIL_PASS,
	MAIL_PORT
} = process.env

const NODE_ENV: Envs = (ProcessEnv as Envs) || 'development'

const dbConfig: ConnectionAttributes = {
	user: DATABASE_USER ?? 'oracle',
	password: DATABASE_PASS ?? 'oracle',
	connectionString: DATABASE_URI ?? 'localhost:1521/ORCLCDB.localdomain'
}

const mailConfig: MailerOptions['transport'] = {
	host: MAIL_HOST ?? 'smtp.mailtrap.io',
	port: MAIL_PORT ?? 2525,
	auth: {
		user: MAIL_USER,
		pass: MAIL_PASS
	}
}

export { NODE_ENV, dbConfig, mailConfig, SECRET }
