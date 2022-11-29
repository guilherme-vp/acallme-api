import { Global, Module } from '@nestjs/common'

import { CallsController } from './calls.controller'
import { CallService } from './calls.service'
import { UseCases } from './use-cases'
import { VideoCallGateway } from './websockets'

@Global()
@Module({
	controllers: [CallsController],
	providers: [...UseCases, CallService, VideoCallGateway],
	exports: [CallService, VideoCallGateway, ...UseCases]
})
export class CallsModule {}
