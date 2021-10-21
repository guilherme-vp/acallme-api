import { Global, Module } from '@nestjs/common'

import { PatientsController } from './patients.controller'
import { PatientService } from './patients.service'
import { PatientRepository } from './repositories'
import { UseCases } from './use-cases'

@Global()
@Module({
	controllers: [PatientsController],
	providers: [...UseCases, PatientService, PatientRepository],
	exports: [...UseCases, PatientService]
})
export class PatientsModule {}
