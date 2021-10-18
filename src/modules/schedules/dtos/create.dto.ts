import { IsOptional, IsDateString, IsNumber } from 'class-validator'

export class CreateDto {
	@IsDateString()
	dateStart!: string

	@IsDateString()
	dateEnd!: string

	@IsOptional()
	@IsNumber()
	patientId?: number
}
