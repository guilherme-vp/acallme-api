import { Roles } from '@common/decorators'
import { Role } from '@common/domain/enums'
import { AuthGuard, CallGuard, RolesGuard } from '@common/guards'
import { Patient } from '@modules/patients/decorators'
import { Specialist } from '@modules/specialists/decorators'
import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common'

import { CreateDto, DisableDto, FindManyDto } from './dtos'
import { SchedulesService } from './schedules.service'

@Controller('schedules')
export class SchedulesController {
	constructor(private readonly schedulesService: SchedulesService) {}

	@UseGuards(AuthGuard, RolesGuard, CallGuard)
	@Roles(Role.Specialist)
	@Post('confirm/:scheduleId')
	async confirmSchedule(
		@Param('scheduleId') scheduleId: string,
		@Specialist('id') specialistId: number,
		@Body('confirmed') confirmed: boolean
	) {
		const data = await this.schedulesService.confirm(specialistId, +scheduleId, confirmed)

		return {
			ok: data
		}
	}

	@UseGuards(AuthGuard)
	@Get()
	async findMany(@Query() query: FindManyDto) {
		const data = await this.schedulesService.getMany(query)

		return {
			schedules: data
		}
	}

	@UseGuards(AuthGuard, CallGuard)
	@Get(':id')
	async findById(@Param('id') id: string) {
		const data = await this.schedulesService.getById(+id)

		return {
			schedule: data
		}
	}

	@UseGuards(AuthGuard, RolesGuard)
	@Roles(Role.Patient)
	@Post()
	async create(@Body() input: CreateDto, @Patient('id') patientId: number) {
		const data = await this.schedulesService.create(input, patientId)

		return {
			schedule: data
		}
	}

	@UseGuards(AuthGuard, RolesGuard, CallGuard)
	@Roles(Role.Specialist)
	@Put('disable')
	async disable(@Body() input: DisableDto, @Specialist('id') specialistId: number) {
		const data = await this.schedulesService.disable(input, specialistId)

		return {
			ok: data
		}
	}
}
