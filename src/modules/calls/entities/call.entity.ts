import { Prisma } from '@prisma/client'

export interface Call {
	id: number
	scheduleId: number
	recordId?: number
	duration?: number | null
	rating?: Prisma.Decimal | null
}
