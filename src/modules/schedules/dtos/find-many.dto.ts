import { IsOptional, IsDateString, IsBooleanString, IsNumberString } from 'class-validator'

export class FindManyDto {
	@IsDateString()
	@IsOptional()
	startsAt?: string

	@IsDateString()
	@IsOptional()
	endsAt?: string

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
