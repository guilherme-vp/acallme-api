import path from 'path'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { config } from '@main/config'
import { NODE_ENV } from '@constants/configuration'
import { UserModule } from '@modules/index'
import { DatabaseModule } from '@services/database'
import { I18nModule, I18nJsonParser as LocaleParser } from 'nestjs-i18n'

const IS_DEV = NODE_ENV === 'development'

@Module({
	imports: [
		DatabaseModule,
		UserModule,
		I18nModule.forRoot({
			fallbackLanguage: 'pt-BR',
			fallbacks: {
				pt: 'pt-BR'
			},
			parser: LocaleParser,
			parserOptions: {
				path: path.join(__dirname, 'locales'),
				watch: true
			}
		}),
		GraphQLModule.forRoot({
			autoSchemaFile: true,
			cors: '*',
			debug: IS_DEV,
			context: ({ req, connection }) => (connection ? { req: connection.context } : { req })
		}),
		ConfigModule.forRoot({ isGlobal: true, load: [config] })
	]
})
export class AppModule {}
