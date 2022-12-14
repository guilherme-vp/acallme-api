import { Exclude } from 'class-transformer'
import {
	IsDateString,
	IsEmail,
	IsNumber,
	IsOptional,
	IsString,
	Length,
	Matches,
	MinLength
} from 'class-validator'

import { UserGender } from '@common/domain/enums'

export class SignUpDto {
	@IsEmail()
	email!: string

	@IsString()
	@Length(2, 50)
	name!: string

	@Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,}$/)
	@IsString()
	password!: string

	@Exclude()
	file?: Express.Multer.File

	@IsString()
	// @Length(11, 14)
	@IsOptional()
	cnpj?: string

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
	@MinLength(8)
	phone!: string

	@IsString()
	@MinLength(0)
	about!: string

	@IsNumber()
	cost!: number

	@IsString({ each: true })
	specialties!: string[]
}
