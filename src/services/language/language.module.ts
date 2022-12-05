import path from 'path'

import { Module, Global } from '@nestjs/common'
import {
	I18nModule,
	I18nJsonLoader,
	HeaderResolver,
	AcceptLanguageResolver
} from 'nestjs-i18n'

@Global()
@Module({
	imports: [
		I18nModule.forRoot({
			fallbackLanguage: 'pt-BR',
			loader: I18nJsonLoader,
			loaderOptions: {
				path: path.join(__dirname, '/locales/'),
				watch: true
			},
			resolvers: [new HeaderResolver(['x-custom-lang']), AcceptLanguageResolver]
		})
	],
	exports: [I18nModule]
})
export class LanguageModule {}
