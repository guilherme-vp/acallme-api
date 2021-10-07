import { UserFormattedModel } from '@common/domain/entities'

declare module 'fastify' {
	export interface FastifyRequest {
		user: UserFormattedModel
	}
}
