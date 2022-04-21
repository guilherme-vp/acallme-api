import { IsOptional, IsDateString, IsNumber, IsBoolean } from 'class-validator'

export class FindOneDto {
	@IsDateString()
	@IsOptional()
	startsAt?: string

	@IsDateString()
	@IsOptional()
	endsAt?: string

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
