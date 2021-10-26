import { Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Patient } from './entities'
import { PatientsController } from './patients.controller'
import { PatientService } from './patients.service'
import { UseCases } from './use-cases'

@Global()
@Module({
	imports: [TypeOrmModule.forFeature([Patient])],
	controllers: [PatientsController],
	providers: [...UseCases, PatientService],
	exports: [PatientService, TypeOrmModule]
})
export class PatientsModule {}
