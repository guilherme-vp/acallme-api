import {
	IsDate,
	IsEmail,
	IsEnum,
	IsOptional,
	IsPhoneNumber,
	IsString,
	Length,
	Matches
} from 'class-validator'

import { UserGender } from '~domain/enums'

export class SignUpDto {
	@IsEmail()
	email!: string

	@IsString()
	@Length(2, 50)
	name!: string

	@Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/)
	password!: string

	@Matches(/?[0-9]{3}?[0-9]{3}?[0-9]{3}?[0-9]{2}{11}/)
	cpf!: string

	@IsEnum(UserGender)
	gender!: UserGender

	@IsDate()
	birth!: Date

	@IsPhoneNumber('BR')
	@IsOptional()
	phone?: string
}
