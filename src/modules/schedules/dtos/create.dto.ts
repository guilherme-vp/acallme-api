import { IsDateString, IsNumber, Min } from 'class-validator'

export class CreateDto {
	@IsDateString()
	dateStart!: string

	@IsDateString()
	dateEnd!: string

	@IsNumber()
	@Min(1)
	specialistId!: number
}
