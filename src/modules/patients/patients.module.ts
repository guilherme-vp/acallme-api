import { Module } from '@nestjs/common'
import { ServicesModule } from '@services/services.module'

import { PatientsController } from './patients.controller'
import { PatientService } from './patients.service'
import { PatientRepository } from './repositories'
import { UseCases } from './use-cases'

@Module({
	imports: [ServicesModule],
	controllers: [PatientsController],
	providers: [...UseCases, PatientService, PatientRepository]
})
export class PatientsModule {}
