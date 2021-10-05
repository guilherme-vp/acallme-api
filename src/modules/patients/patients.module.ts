import { Module } from '@nestjs/common'
import { ServicesModule } from '@services/services.module'

import { PatientsController } from './patients.controller'
import { PatientRepository } from './repositories'
import { UseCases, UseCasesService } from './use-cases'

@Module({
	imports: [ServicesModule],
	controllers: [PatientsController],
	providers: [...UseCases, UseCasesService, PatientRepository]
})
export class PatientsModule {}
