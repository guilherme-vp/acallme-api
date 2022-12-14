import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common'

import { Roles } from '@common/decorators'
import { Role } from '@common/domain/enums'
import { AuthGuard, RolesGuard } from '@common/guards'

import { Patient } from './decorators'
import { LoginDto, SignUpDto } from './dtos'
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
		const data = await this.patientService.findById(id)

		return {
			me: data
		}
	}

	@UseGuards(AuthGuard, RolesGuard)
	@Get(':id')
	async findById(@Param('id') id: string) {
		const data = await this.patientService.findById(+id)

		return {
			patient: data
		}
	}
}
