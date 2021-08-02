import { Field, InputType } from '@nestjs/graphql'
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

import { UserGender } from '~modules/common/enums'

@InputType()
export class SignUpDto {
	@IsEmail()
	@Field()
	email!: string

	@IsString()
	@Length(2, 50)
	@Field()
	name!: string

	@Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/)
	@Field()
	password!: string

	@Matches(/?[0-9]{3}?[0-9]{3}?[0-9]{3}?[0-9]{2}{11}/)
	@Field(() => String)
	cpf!: string

	@IsEnum(UserGender)
	@Field(() => UserGender)
	gender!: UserGender

	@IsDate()
	@IsOptional()
	@Field(() => Date, { nullable: true })
	birth?: Date

	@IsPhoneNumber('BR')
	@IsOptional()
	@Field({ nullable: true })
	phone?: string
}
