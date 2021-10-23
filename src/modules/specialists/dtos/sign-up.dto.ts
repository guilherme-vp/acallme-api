import { UserGender } from '@common/domain/enums'
import {
	IsDateString,
	IsEmail,
	IsNumber,
	IsNumberString,
	IsOptional,
	IsString,
	IsUrl,
	Length,
	Matches,
	Min,
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

	@IsUrl()
	@IsOptional()
	avatarUrl?: string

	@IsString()
	cnpj!: string

	@IsString()
	@Length(11, 14)
	cpf!: string

	@IsString()
	@IsOptional()
	crp?: string

	@IsString()
	@IsOptional()
	crm?: string

	@IsString()
	@Length(1, 2)
	gender!: UserGender

	@IsDateString()
	birth!: string

	@IsString()
	phone!: string

	@IsString()
	@MinLength(0)
	about!: string

	@IsNumberString()
	cost!: string

	@IsString({ each: true })
	specialties!: string[]
}
