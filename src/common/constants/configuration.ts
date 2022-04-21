import { MailerOptions } from '@nestjs-modules/mailer'

type Envs = 'development' | 'production'

const {
	PORT,
	NODE_ENV: ProcessEnv,
	SECRET = 'test123',
	MAIL_HOST,
	MAIL_USER,
	MAIL_PASS,
	MAIL_PORT
} = process.env

const NODE_ENV: Envs = (ProcessEnv as Envs) || 'development'

const mailConfig: MailerOptions['transport'] = {
	host: MAIL_HOST ?? 'smtp.mailtrap.io',
	port: MAIL_PORT ?? 2525,
	auth: {
		user: MAIL_USER,
		pass: MAIL_PASS
	}
}

export { NODE_ENV, mailConfig, SECRET, PORT }
