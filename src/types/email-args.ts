import { RequireOnlyOne } from './require-only-one'

export interface IAddress {
	address: string
	name?: string | undefined
}

export type IMessage = {
	/**
	 * Defaults are:
	 *
	 * `from.name = "Acall me"`
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
	},
	'html'
>

export interface IMailService {
	sendMail(message: IMessage): Promise<void>
}
