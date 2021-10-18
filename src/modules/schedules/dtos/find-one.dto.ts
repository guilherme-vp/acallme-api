import { IsOptional, IsDateString, IsNumber, IsBoolean } from 'class-validator'

export class FindOneDto {
	@IsDateString()
	@IsOptional()
	rangeStart?: string

	@IsDateString()
	@IsOptional()
	rangeEnd?: string

	@IsOptional()
	@IsNumber()
	appointmentId?: number

	@IsOptional()
	@IsNumber()
	specialistId?: number

	@IsOptional()
	@IsNumber()
	patientId?: number

	@IsOptional()
	@IsBoolean()
	confirmed?: boolean
}
