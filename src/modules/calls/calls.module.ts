import { Global, Module } from '@nestjs/common'
import { ServicesModule } from '@services/services.module'

import { CallsController } from './calls.controller'
import { CallService } from './calls.service'
import { CallRepository } from './repositories'
import { UseCases } from './use-cases'

@Global()
@Module({
	imports: [ServicesModule],
	controllers: [CallsController],
	providers: [...UseCases, CallService, CallRepository],
	exports: [CallService]
})
export class CallsModule {}
