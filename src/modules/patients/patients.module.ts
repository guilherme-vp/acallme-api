import { Global, Module } from '@nestjs/common'
import { ServicesModule } from '@services/services.module'

import { PatientsController } from './patients.controller'
import { PatientService } from './patients.service'
import { PatientRepository } from './repositories'
import { UseCases } from './use-cases'

@Global()
@Module({
	imports: [ServicesModule],
	controllers: [PatientsController],
	providers: [...UseCases, PatientService, PatientRepository],
	exports: [...UseCases, PatientService]
})
export class PatientsModule {}
