import { Role } from '@common/domain/enums'
import { UserModel } from '@common/domain/models'
import { Call } from '@modules/calls/entities'
import { Schedule } from '@modules/schedules/entities'

declare module 'express' {
	export interface Request {
		user: UserModel & { id: number; role: Role }
	}
}

declare module 'socket.io' {
	export interface Socket {
		schedule?: Schedule
		call?: Call
	}
}
