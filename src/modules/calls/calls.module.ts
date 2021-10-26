import { Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CallsController } from './calls.controller'
import { CallService } from './calls.service'
import { Call } from './entities'
import { UseCases } from './use-cases'
import { Gateways } from './websockets'

@Global()
@Module({
	imports: [TypeOrmModule.forFeature([Call])],
	controllers: [CallsController],
	providers: [...UseCases, ...Gateways, CallService],
	exports: [CallService, TypeOrmModule, ...UseCases]
})
export class CallsModule {}
