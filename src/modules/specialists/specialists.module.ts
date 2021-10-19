import { SchedulesModule } from '@modules/schedules/schedules.module'
import { forwardRef, Global, Module } from '@nestjs/common'
import { ServicesModule } from '@services/services.module'

import { SpecialistRepository } from './repositories'
import { SpecialistsController } from './specialists.controller'
import { SpecialistService } from './specialists.service'
import { UseCases } from './use-cases'

@Global()
@Module({
	imports: [ServicesModule, forwardRef(() => SchedulesModule)],
	controllers: [SpecialistsController],
	providers: [...UseCases, SpecialistService, SpecialistRepository],
	exports: [...UseCases, SpecialistService]
})
export class SpecialistsModule {}
