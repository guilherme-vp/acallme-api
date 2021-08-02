import { Inject } from '@nestjs/common'
import { Query, Mutation, Args } from '@nestjs/graphql'

import { PatientModel } from '../models'
import { SignUpDto } from '~modules/patient/dtos'
import { UseCasesService } from '~modules/patient/use-cases'

export class AuthenticationResolver {
	constructor(@Inject('PATIENT_USECASE') private readonly useCasesService: UseCasesService) {}

	@Query(() => String)
	HelloWorld() {
		return 'Hello'
	}

	@Mutation(() => PatientModel)
	async createUser(@Args('patientInput') input: SignUpDto) {
		return this.useCasesService.signUp(input)
	}
}
