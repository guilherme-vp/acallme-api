import { Global, Module } from '@nestjs/common'

import { CallsController } from './calls.controller'
import { CallService } from './calls.service'
import { UseCases } from './use-cases'
import { Gateways } from './websockets'

@Global()
@Module({
	controllers: [CallsController],
	providers: [...UseCases, ...Gateways, CallService],
	exports: [CallService, ...UseCases]
})
export class CallsModule {}
