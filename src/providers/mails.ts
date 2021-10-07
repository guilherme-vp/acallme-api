import path from 'path'

import { IReturnMail } from '@core/types/email-args'
import { WelcomeMailVars, generateWelcomeMail } from '@core/views/mails'

export const welcomeEmailProps = (args: WelcomeMailVars): IReturnMail => {
	return {
		subject: 'Estamos felizes que você está conosco!',
		html: generateWelcomeMail(args),
		attachments: [
			{
				filename: 'clock.png',
				cid: 'clock',
				path: path.resolve(__dirname, '..', 'assets', 'images', 'clock.png')
			},
			{
				filename: 'heart.png',
				cid: 'heart',
				path: path.resolve(__dirname, '..', 'assets', 'images', 'heart.png')
			}
		]
	}
}
