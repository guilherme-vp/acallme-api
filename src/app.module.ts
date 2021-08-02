import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'

import { NODE_ENV } from '~constants/configuration'
import { PatientModule } from '~core/modules'
import { DatabaseModule, LanguageModule } from '~core/services'
import { config } from '~main/config'

const IS_DEV = NODE_ENV === 'development'

@Module({
	imports: [
		DatabaseModule,
		PatientModule,
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
