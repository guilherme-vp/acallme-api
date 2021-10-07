import { UserFormattedModel } from '@common/domain/entities'
import { Role } from '@common/domain/enums'

declare module 'fastify' {
	export interface FastifyRequest {
		user: UserFormattedModel & { role: Role }
	}
}
