import { Roles } from '@core/decorators'
import { AuthGuard } from '@core/guards'
import { Role } from '@domain/enums'
import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common'

import { Specialist } from './decorators'
import { LoginDto, SignUpDto } from './dtos'
import { SpecialistModel } from './entities'
import { SpecialistService } from './specialists.service'

@Controller('specialists')
export class SpecialistsController {
	constructor(private readonly specialistService: SpecialistService) {}

	@Post('signup')
	async signUp(@Body() input: SignUpDto) {
		return this.specialistService.signUp(input)
	}

	@Post('login')
	async login(@Body() input: LoginDto) {
		return this.specialistService.login(input)
	}

	@UseGuards(AuthGuard)
	@Get('me')
	async me(@Specialist('id') id: number) {
		return this.specialistService.findById(id)
	}

	@UseGuards(AuthGuard)
	@Roles(Role.Specialist, Role.Specialist)
	@Get(':id')
	async findById(@Param('id') id: string) {
		return this.specialistService.findById(+id)
	}

	@UseGuards(AuthGuard)
	@Roles(Role.Specialist, Role.Specialist)
	@Get()
	async findOne(@Query() query: SpecialistModel) {
		return this.specialistService.findOne(query)
	}
}
