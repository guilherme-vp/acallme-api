import { UserGender } from '@common/domain/enums'
import {
	IsDateString,
	IsEmail,
	IsEnum,
	IsOptional,
	IsString,
	IsUrl,
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

	@IsString({ each: true })
	roles!: string[]
}
