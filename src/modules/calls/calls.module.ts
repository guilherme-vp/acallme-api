import { Global, Module } from '@nestjs/common'

import { CallsController } from './calls.controller'
import { CallService } from './calls.service'
import { CallRepository } from './repositories'
import { UseCases } from './use-cases'
import { Gateways } from './websockets'

@Global()
@Module({
	controllers: [CallsController],
	providers: [...UseCases, ...Gateways, CallService, CallRepository],
	exports: [CallService]
})
export class CallsModule {}
