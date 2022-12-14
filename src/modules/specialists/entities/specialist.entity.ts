import { Prisma } from '@prisma/client'

import { UserModel } from '@common/domain/models'

export interface Specialist extends UserModel {
	cnpj?: string | null
	about?: string | null
	cost: Prisma.Decimal
	crp?: string | null
	crm?: string | null
}
