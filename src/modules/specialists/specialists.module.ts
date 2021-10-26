import { Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Specialist, Specialty } from './entities'
import { SpecialistsController } from './specialists.controller'
import { SpecialistService } from './specialists.service'
import { UseCases } from './use-cases'

@Global()
@Module({
	imports: [TypeOrmModule.forFeature([Specialist, Specialty])],
	controllers: [SpecialistsController],
	providers: [...UseCases, SpecialistService],
	exports: [SpecialistService, TypeOrmModule]
})
export class SpecialistsModule {}
