import { IsOptional, IsEmail, IsString, Length } from 'class-validator'

export class FindOneDto {
	@IsEmail()
	@IsOptional()
	email?: string

	@IsString()
	@IsOptional()
	name?: string

	@IsString()
	@Length(14, 14)
	@IsOptional()
	cnpj?: string

	@IsString()
	@Length(11, 11)
	@IsOptional()
	cpf?: string

	@IsString()
	@Length(4, 8)
	@IsOptional()
	crp?: string

	@IsString()
	@Length(3, 6)
	@IsOptional()
	crm?: string
}
