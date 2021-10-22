import { IsDateString } from 'class-validator'

export class DisableDto {
	@IsDateString()
	dateStart!: string

	@IsDateString()
	dateEnd!: string
}
