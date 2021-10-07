import { Roles } from '@core/decorators'
import { AuthGuard, RolesGuard } from '@core/guards'
import { Role } from '@domain/enums'
import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common'

import { Patient } from './decorators'
import { LoginDto, SignUpDto } from './dtos'
import { PatientModel } from './entities'
import { PatientService } from './patients.service'

@Controller('patients')
export class PatientsController {
	constructor(private readonly patientService: PatientService) {}

	@Post('signup')
	async signUp(@Body() input: SignUpDto) {
		return this.patientService.signUp(input)
	}

	@Post('login')
	async login(@Body() input: LoginDto) {
		return this.patientService.login(input)
	}

	@UseGuards(AuthGuard, RolesGuard)
	@Roles(Role.Patient)
	@Get('me')
	async me(@Patient('id') id: number) {
		return this.patientService.findById(id)
	}

	@UseGuards(AuthGuard, RolesGuard)
	@Get(':id')
	async findById(@Param('id') id: string) {
		return this.patientService.findById(+id)
	}

	@UseGuards(AuthGuard)
	@Get()
	async findOne(@Query() query: PatientModel) {
		return this.patientService.findOne(query)
	}
}
