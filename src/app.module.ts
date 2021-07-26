import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { NODE_ENV } from 'constants/configuration'
import { config } from 'main/config'
import { DatabaseModule } from 'services'

const IS_DEV = NODE_ENV === 'development'

@Module({
	imports: [
		DatabaseModule,
		GraphQLModule.forRoot({
			autoSchemaFile: true,
			cors: '*',
			debug: IS_DEV
		}),
		ConfigModule.forRoot({ isGlobal: true, load: [config] })
	]
})
export class AppModule {}
