import { ROLES_KEY } from '@common/decorators'
import { Role } from '@common/domain/enums'
import { Injectable, CanActivate, ExecutionContext, Logger } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

@Injectable()
export class RolesGuard implements CanActivate {
	private logger: Logger = new Logger('RolesGuard')
	constructor(private reflector: Reflector) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		this.logger.log('Get roles key insied key')
		const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
			context.getHandler(),
			context.getClass()
		])

		if (!requiredRoles) {
			this.logger.log('If guard not defined, return true')
			return true
		}

		this.logger.log('Get user inside http context')
		const { user } = context.switchToHttp().getRequest()

		this.logger.log('Verify if user role is allowed')
		return requiredRoles.some(role => role === user.role)
	}
}
