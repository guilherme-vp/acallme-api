import { Global, Module } from '@nestjs/common'

import { PatientsController } from './patients.controller'
import { PatientService } from './patients.service'
import { UseCases } from './use-cases'

@Global()
@Module({
	controllers: [PatientsController],
	providers: [...UseCases, PatientService],
	exports: [PatientService]
})
export class PatientsModule {}
