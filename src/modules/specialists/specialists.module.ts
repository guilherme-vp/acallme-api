import { Global, Module } from '@nestjs/common'

import { SpecialistsController } from './specialists.controller'
import { SpecialistService } from './specialists.service'
import { UseCases } from './use-cases'

@Global()
@Module({
	controllers: [SpecialistsController],
	providers: [...UseCases, SpecialistService],
	exports: [SpecialistService]
})
export class SpecialistsModule {}
