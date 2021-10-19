import { IsOptional, IsEmail, IsString, Length } from 'class-validator'

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
}
