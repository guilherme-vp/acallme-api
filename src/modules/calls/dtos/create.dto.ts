import { Prisma } from '@prisma/client'
import { IsNumber, IsOptional, Min } from 'class-validator'

export class CreateDto {
	@IsNumber()
	@Min(0)
	scheduleId!: number

	@IsNumber()
	@Min(0)
	@IsOptional()
	duration?: number | null

	@IsNumber({ maxDecimalPlaces: 1 })
	@Min(0)
	@IsOptional()
	rating?: Prisma.Decimal | null
}
