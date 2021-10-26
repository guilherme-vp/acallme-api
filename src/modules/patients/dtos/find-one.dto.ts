import { IsOptional, IsEmail, IsString, Length } from 'class-validator'

export class FindOneDto {
	@IsEmail()
	@IsOptional()
	email?: string

	@IsString()
	@IsOptional()
	name?: string

	@IsString()
	@Length(11, 11)
	@IsOptional()
	cpf?: string
}
