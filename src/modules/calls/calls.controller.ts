import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common'

import { Roles } from '@common/decorators'
import { Role } from '@common/domain/enums'
import { AuthGuard, RolesGuard } from '@common/guards'

import { CallService } from './calls.service'
import { CreateDto } from './dtos'

@Controller('calls')
export class CallsController {
	constructor(private readonly callService: CallService) {}

	@UseGuards(AuthGuard, RolesGuard)
	@Roles(Role.Patient)
	@Post()
	async create(@Body() input: CreateDto) {
		return this.callService.create(input)
	}

	@UseGuards(AuthGuard)
	@Get()
	async getMany(@Query() where?: any) {
		return this.callService.findMany(where)
	}
}
