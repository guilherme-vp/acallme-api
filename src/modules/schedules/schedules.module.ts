import { Global, Module } from '@nestjs/common'
import { ServicesModule } from '@services/services.module'

import { Repositories } from './repositories'
import { SchedulesService } from './schedules.service'
import { UseCases } from './use-cases'

@Global()
@Module({
	imports: [ServicesModule],
	providers: [...UseCases, ...Repositories, SchedulesService],
	exports: [...UseCases, SchedulesService]
})
export class SchedulesModule {}
