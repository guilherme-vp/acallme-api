import path from 'path'

import { Module, Global } from '@nestjs/common'
import {
	I18nModule,
	I18nJsonParser as LocaleParser,
	HeaderResolver,
	AcceptLanguageResolver
} from 'nestjs-i18n'

@Global()
@Module({
	imports: [
		I18nModule.forRoot({
			fallbackLanguage: 'pt-BR',
			parser: LocaleParser,
			parserOptions: {
				path: path.join(__dirname, '/locales/')
			},
			resolvers: [new HeaderResolver(['x-custom-lang']), AcceptLanguageResolver]
		})
	],
	exports: [I18nModule]
})
export class LanguageModule {}
