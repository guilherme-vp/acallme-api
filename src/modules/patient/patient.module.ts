import { Module } from '@nestjs/common'

import { AuthenticationResolver } from './graphql/resolvers'
import { PatientRepository } from './repositories'
import { UseCases, UseCasesService } from './use-cases'
import { LanguageModule, DatabaseModule } from '~core/services'

@Module({
	imports: [LanguageModule, DatabaseModule],
	providers: [...UseCases, UseCasesService, PatientRepository, AuthenticationResolver]
})
export class PatientModule {}
