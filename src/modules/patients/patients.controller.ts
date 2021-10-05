import { Controller, Post, Body } from '@nestjs/common'

import { SignUpDto } from './dtos'
import { UseCasesService } from './use-cases'

@Controller('patients')
export class PatientsController {
	constructor(private readonly useCasesService: UseCasesService) {}

	@Post('signup')
	async signUp(@Body() input: SignUpDto) {
		return this.useCasesService.signUp(input)
	}
}
