import { IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator'

export class CreateDto {
	@IsNumber()
	@Min(0)
	callId!: number

	@IsString()
	@MinLength(1)
	diagnosis!: string

	@IsString()
	@MinLength(1)
	@IsOptional()
	observation?: string
}
