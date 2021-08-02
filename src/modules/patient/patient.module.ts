import { Module } from '@nestjs/common'

import { PatientRepository } from './repositories'
import { UseCasesService } from './use-cases'
import { LanguageModule, DatabaseModule } from '~core/services'

@Module({
	imports: [LanguageModule, DatabaseModule],
	providers: [
		{
			provide: 'PATIENT_USECASE',
			useClass: UseCasesService
		},
		{
			provide: 'PATIENT_REPOSITORY',
			useClass: PatientRepository
		}
	]
})
export class PatientModule {}
