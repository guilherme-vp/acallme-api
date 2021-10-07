import { ISendMailOptions } from '@nestjs-modules/mailer'

import { RequireOnlyOne } from './require-only-one'

export interface IAddress {
	address: string
	name: string
}

export type IMessage = {
	/**
	 * Defaults are:
	 *
	 * `from.name = "ACall me"`
	 *
	 * `from.address = "acallme.vortechs@gmail.com"`
	 */
	from?: IAddress
	to: IAddress
	subject: string
	html: string
}

export type IReturnMail = RequireOnlyOne<
	{
		subject: string
		html?: string
		attachments?: ISendMailOptions['attachments']
	},
	'html'
>

export interface IMailService {
	sendMail(message: IMessage): Promise<void>
}
