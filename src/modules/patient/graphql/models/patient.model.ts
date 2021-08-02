import { Field, ObjectType } from '@nestjs/graphql'

import { UserModel } from '~modules/common/graphql/models'

@ObjectType()
export class PatientModel extends UserModel {
	@Field(() => Boolean)
	isTourCompleted?: boolean
}
