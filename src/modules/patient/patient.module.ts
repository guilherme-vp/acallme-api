import { Module } from '@nestjs/common'

import { PatientRepository } from './repositories'
import { UseCases, UseCasesService } from './use-cases'
import { ServicesModule } from '~core/services'

@Module({
	imports: [ServicesModule],
	providers: [...UseCases, UseCasesService, PatientRepository]
})
export class PatientModule {}
