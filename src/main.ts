import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'
import { NestConfig } from '~main/config'

const bootstrap = async () => {
	const app = await NestFactory.create(AppModule)
	const configService = app.get(ConfigService)
	const nestConfig = configService.get<NestConfig>('nest')

	const port = nestConfig?.port || 5002

	await app.listen(port, () => {
		Logger.log(`App runing at port: ${port}`)
	})
}

bootstrap()
