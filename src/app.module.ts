import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { config } from '@main/config'
import { NODE_ENV } from '@constants/configuration'
import { UserModule } from '@modules/index'
import { DatabaseModule } from '@services/database'
import { LanguageModule } from '@modules/language'

const IS_DEV = NODE_ENV === 'development'

@Module({
	imports: [
		DatabaseModule,
		UserModule,
		LanguageModule,
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
