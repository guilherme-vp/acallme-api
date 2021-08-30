import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'

import { AppModule } from './app.module'
import { NestConfig } from '~main/config'

const bootstrap = async () => {
	const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter())
	const configService = app.get(ConfigService)
	const nestConfig = configService.get<NestConfig>('nest')

	const port = nestConfig?.port || 5005

	await app.listen(port, () => {
		Logger.log(`App running at port: ${port}`)
	})
}

bootstrap()
