import { IsEmail, IsString, IsOptional } from 'class-validator'

export class LoginDto {
	@IsEmail()
	@IsOptional()
	email?: string

	@IsString()
	@IsOptional()
	cnpj?: string

	@IsString()
	password!: string
}
