import { IMessage } from '@core/types/email-args'
import { MailerService as NestMailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'

@Injectable()
export class MailerService {
	constructor(private readonly mailerService: NestMailerService) {}

	public async send(message: IMessage): Promise<void> {
		try {
			await this.mailerService.sendMail({
				from: {
					name: 'ACall me',
					address: 'admin@acallme.com.br'
				},
				...message
			})
		} catch (error) {
			console.error(error)
		}
	}
}
