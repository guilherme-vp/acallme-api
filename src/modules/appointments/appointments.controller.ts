import { Roles } from '@common/decorators'
import { Role } from '@common/domain/enums'
import { AppointmentGuard, AuthGuard, RolesGuard } from '@common/guards'
import { Patient } from '@modules/patients/decorators'
import { PatientFormatted } from '@modules/patients/entities'
import { Specialist } from '@modules/specialists/decorators'
import {
	Body,
	CacheInterceptor,
	Controller,
	Get,
	Param,
	Post,
	Query,
	UseGuards,
	UseInterceptors
} from '@nestjs/common'

import { AppointmentService } from './appointments.service'
import { CreateDto } from './dtos'

@Controller('appointments')
@UseInterceptors(CacheInterceptor)
export class AppointmentsController {
	constructor(private readonly appointmentService: AppointmentService) {}

	@UseGuards(AuthGuard, RolesGuard)
	@Roles(Role.Patient)
	@Post()
	async create(@Body() input: CreateDto, @Patient() patient: PatientFormatted) {
		return this.appointmentService.create(input, patient)
	}

	@UseGuards(AuthGuard)
	@Get()
	async getMany(@Query() where?: any) {
		return this.appointmentService.findMany(where)
	}

	@UseGuards(AuthGuard, RolesGuard, AppointmentGuard)
	@Roles(Role.Specialist)
	@Post('confirm/:appointmentId')
	async confirm(
		@Specialist('id') id: string,
		@Param('appointmentId') appointmentId: string
	) {
		return this.appointmentService.confirm(+id, +appointmentId)
	}
}
