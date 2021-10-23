import { IsOptional, IsDateString, IsBooleanString, IsNumberString } from 'class-validator'

export class FindManyDto {
	@IsDateString()
	@IsOptional()
	rangeStart?: string

	@IsDateString()
	@IsOptional()
	rangeEnd?: string

	@IsOptional()
	@IsNumberString()
	callId?: string

	@IsOptional()
	@IsNumberString()
	specialistId?: string

	@IsOptional()
	@IsNumberString()
	patientId?: string

	@IsOptional()
	@IsBooleanString()
	confirmed?: string

	@IsOptional()
	@IsBooleanString()
	disabled?: string
}
