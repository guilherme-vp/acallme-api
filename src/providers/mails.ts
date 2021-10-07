import { IReturnMail } from '@core/types/email-args'
import { WelcomeMailVars, generateWelcomeMail } from '@core/views/mails'

export const welcomeEmailProps = (args: WelcomeMailVars): IReturnMail => {
	return {
		subject: 'Estamos felizes que você está conosco!',
		html: generateWelcomeMail(args)
	}
}
