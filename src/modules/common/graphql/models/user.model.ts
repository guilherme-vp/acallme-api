import { Field, ID, ObjectType } from '@nestjs/graphql'

import { UserGender } from '~modules/common/enums'

@ObjectType()
export class UserModel {
	@Field(() => ID)
	id!: string

	@Field()
	name!: string

	@Field()
	email!: string

	password!: string

	@Field(() => Date, { nullable: true })
	birth?: Date

	@Field()
	cpf!: string

	@Field(() => UserGender)
	gender!: UserGender

	@Field(() => Boolean)
	isEmailVerified?: boolean

	@Field({ nullable: true })
	phone?: string

	@Field(() => Date)
	createdAt!: Date

	@Field(() => Date)
	updatedAt!: Date
}
