import { UserGender } from '@domain/enums'
import {
	IsDateString,
	IsEmail,
	IsEnum,
	IsOptional,
	IsString,
	Length,
	Matches,
	MinLength
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
	@MinLength(11)
	cpf!: string

	@IsEnum(UserGender)
	gender!: UserGender

	@IsDateString()
	birth!: string

	@IsString()
	@IsOptional()
	@MinLength(11)
	phone?: number
}
