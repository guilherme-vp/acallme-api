import { Controller, Get, Post, Body, Param } from '@nestjs/common'

import { SignUpDto } from './dtos'
import { PatientService } from './patients.service'

@Controller('patients')
export class PatientsController {
	constructor(private readonly patientService: PatientService) {}

	@Post('signup')
	async signUp(@Body() input: SignUpDto) {
		return this.patientService.signUp(input)
	}

	@Get(':id')
	findById(@Param('id') id: string) {
		return this.patientService.findById(+id)
	}
}
