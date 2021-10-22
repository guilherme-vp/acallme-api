import { IsOptional, IsEmail, IsString, Length, IsNumberString } from 'class-validator'

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

	@IsNumberString({ no_symbols: true })
	@IsOptional()
	page?: string

	@IsNumberString({ no_symbols: true })
	@IsOptional()
	limit?: string
}
