import { IsNumber, IsOptional } from 'class-validator'

export class FindManyDto {
	@IsNumber()
	@IsOptional()
	scheduleId?: number

	@IsNumber()
	@IsOptional()
	recordId?: number
}
