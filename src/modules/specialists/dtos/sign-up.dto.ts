import { UserGender } from '@domain/enums'
import {
	IsDateString,
	IsEmail,
	IsEnum,
	IsOptional,
	IsString,
	Length,
	Matches
} from 'class-validator'

export class SignUpDto {
	@IsEmail()
	email!: string

	@IsString()
	@Length(2, 50)
	name!: string

	@Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/)
	@IsString()
	password!: string

	@IsString()
	@Length(14, 14)
	cnpj?: string

	@IsString()
	@Length(11, 11)
	cpf?: string

	@IsString()
	@Length(4, 8)
	crp?: string

	@IsString()
	@Length(3, 6)
	crm?: string

	@IsEnum(UserGender)
	gender!: UserGender

	@IsDateString()
	birth!: string

	@IsString()
	@IsOptional()
	@Length(11, 11)
	phone?: number
}
