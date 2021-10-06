import { UserFormattedModel } from '@domain/entities'

declare module 'fastify' {
	export interface FastifyRequest {
		user: UserFormattedModel
	}
}
