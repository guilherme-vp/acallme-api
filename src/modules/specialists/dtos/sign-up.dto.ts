import { UserGender } from '@common/domain/enums'
import {
	IsDateString,
	IsEmail,
	IsEnum,
	IsNumber,
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
	@Length(14, 14)
	cnpj!: string

	@IsString()
	@Length(11, 11)
	cpf!: string

	@IsString()
	@Length(4, 8)
	@IsOptional()
	crp?: string

	@IsString()
	@Length(3, 6)
	@IsOptional()
	crm?: string

	@IsEnum(UserGender)
	gender!: UserGender

	@IsDateString()
	birth!: string

	@IsString()
	@Length(11, 11)
	phone!: number

	@IsString()
	@MinLength(0)
	about!: string

	@IsNumber({ maxDecimalPlaces: 2 })
	@Min(1)
	cost!: number

	@IsString({ each: true })
	specialties!: string[]
}
