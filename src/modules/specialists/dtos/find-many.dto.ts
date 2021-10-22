import { IsOptional, IsEmail, IsString, Length, IsNumber, Min } from 'class-validator'

export class FindManyDto {
	@IsEmail()
	@IsOptional()
	email?: string

	@IsString()
	@IsOptional()
	@Length(0, 100)
	name?: string

	@IsString({ each: true })
	@IsOptional()
	specialties?: string[]

	@IsNumber()
	@IsOptional()
	@Min(1)
	page?: number

	@IsNumber()
	@IsOptional()
	@Min(1)
	limit?: number
}
