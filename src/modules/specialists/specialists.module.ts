import { Global, Module } from '@nestjs/common'

import { SpecialistRepository, SpecialtyRepository } from './repositories'
import { SpecialistsController } from './specialists.controller'
import { SpecialistService } from './specialists.service'
import { UseCases } from './use-cases'

@Global()
@Module({
	controllers: [SpecialistsController],
	providers: [...UseCases, SpecialistService, SpecialistRepository, SpecialtyRepository],
	exports: [SpecialistService]
})
export class SpecialistsModule {}
