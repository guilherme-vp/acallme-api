import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common'

import { Roles } from '@common/decorators'
import { Role } from '@common/domain/enums'
import { AuthGuard, RolesGuard } from '@common/guards'

import { CreateDto } from './dtos'
import { RecordService } from './records.service'

@Controller('records')
export class RecordsController {
	constructor(private readonly recordService: RecordService) {}

	@UseGuards(AuthGuard, RolesGuard)
	@Roles(Role.Specialist)
	@Post()
	async create(@Body() input: CreateDto) {
		return this.recordService.create(input)
	}

	@UseGuards(AuthGuard, RolesGuard)
	@Roles(Role.Specialist)
	@Get(':id')
	async findById(@Param('id') id: string) {
		return this.recordService.findById(+id)
	}
}
