import { Query, Mutation, Args, Resolver } from '@nestjs/graphql'

import { PatientModel } from '../models'
import { SignUpDto } from '~modules/patient/dtos'
import { UseCasesService } from '~modules/patient/use-cases'

@Resolver()
export class AuthenticationResolver {
	constructor(private readonly useCasesService: UseCasesService) {}

	@Query(() => String)
	HelloWorld() {
		return 'Hello'
	}

	@Mutation(() => PatientModel)
	async createUser(@Args('patientInput') input: SignUpDto) {
		return this.useCasesService.signUp(input)
	}
}
