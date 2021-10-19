import { IsOptional, IsDateString, IsNumber, IsBoolean } from 'class-validator'

export class FindManyDto {
	@IsDateString()
	@IsOptional()
	rangeStart?: string

	@IsDateString()
	@IsOptional()
	rangeEnd?: string

	@IsOptional()
	@IsNumber()
	callId?: number

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
