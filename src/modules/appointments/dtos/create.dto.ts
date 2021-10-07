import { IsDateString, IsNumber, Min } from 'class-validator'

export class CreateDto {
	@IsNumber()
	@Min(0)
	specialistId!: number

	@IsNumber({ maxDecimalPlaces: 2 })
	@Min(1)
	cost!: number

	@IsDateString({ strict: true })
	scheduled!: Date
}
