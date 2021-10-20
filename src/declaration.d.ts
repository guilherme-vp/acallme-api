import { UserFormattedModel } from '@common/domain/entities'
import { Role } from '@common/domain/enums'
import { CallFormatted } from '@modules/calls/entities'
import { ScheduleFormatted } from '@modules/schedules/entities'

declare module 'fastify' {
	export interface FastifyRequest {
		user: UserFormattedModel & { role: Role }
	}
}

declare module 'socket.io' {
	export interface Socket {
		schedule?: ScheduleFormatted
		call?: CallFormatted
	}
}
