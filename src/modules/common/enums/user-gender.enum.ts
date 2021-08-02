import { registerEnumType } from '@nestjs/graphql'

export enum UserGender {
	M = 'M',
	F = 'F'
}

registerEnumType(UserGender, { name: 'UserGender' })
