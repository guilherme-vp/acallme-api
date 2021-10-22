import { IsOptional, IsDateString, IsBoolean, IsString } from 'class-validator'

export class FindManyDto {
	@IsDateString()
	@IsOptional()
	rangeStart?: string

	@IsDateString()
	@IsOptional()
	rangeEnd?: string

	@IsOptional()
	@IsString()
	callId?: string

	@IsOptional()
	@IsString()
	specialistId?: string

	@IsOptional()
	@IsString()
	patientId?: string

	@IsOptional()
	@IsBoolean()
	confirmed?: boolean

	@IsOptional()
	@IsBoolean()
	disabled?: boolean
}
