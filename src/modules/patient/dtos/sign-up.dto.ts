import { UserGender } from '@domain/enums'
import {
	IsDate,
	IsEmail,
	IsEnum,
	IsNumber,
	IsOptional,
	IsPhoneNumber,
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

	@Matches(/^?[0-9]{3}?[0-9]{3}?[0-9]{3}?[0-9]{2}{11,}$/)
	@IsNumber()
	@MinLength(11)
	cpf!: number

	@IsEnum(UserGender)
	gender!: UserGender

	@IsDate()
	birth!: Date

	@IsNumber()
	@IsOptional()
	@MinLength(11)
	phone?: number
}
