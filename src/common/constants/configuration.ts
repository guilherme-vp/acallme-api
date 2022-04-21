import { MailerOptions } from '@nestjs-modules/mailer'

type Envs = 'development' | 'production'

const {
	PORT,
	NODE_ENV: ProcessEnv,
	DATABASE_USER,
	DATABASE_PASS,
	SECRET = 'test123',
	MAIL_HOST,
	MAIL_USER,
	MAIL_PASS,
	MAIL_PORT
} = process.env

const NODE_ENV: Envs = (ProcessEnv as Envs) || 'development'

const dbConfig = {
	user: DATABASE_USER ?? 'root',
	password: DATABASE_PASS ?? 'admin'
}

const mailConfig: MailerOptions['transport'] = {
	host: MAIL_HOST ?? 'smtp.mailtrap.io',
	port: MAIL_PORT ?? 2525,
	auth: {
		user: MAIL_USER,
		pass: MAIL_PASS
	}
}

export { NODE_ENV, dbConfig, mailConfig, SECRET, PORT }
