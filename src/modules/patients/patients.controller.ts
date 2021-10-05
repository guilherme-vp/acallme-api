import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common'

import { SignUpDto } from './dtos'
import { PatientModel } from './entities'
import { PatientService } from './patients.service'

@Controller('patients')
export class PatientsController {
	constructor(private readonly patientService: PatientService) {}

	@Post('signup')
	async signUp(@Body() input: SignUpDto) {
		return this.patientService.signUp(input)
	}

	@Get(':id')
	async findById(@Param('id') id: string) {
		return this.patientService.findById(+id)
	}

	@Get()
	async findOne(@Query() query: PatientModel) {
		return this.patientService.findOne(query)
	}
}
