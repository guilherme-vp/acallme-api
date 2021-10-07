import { ROLES_KEY } from '@common/decorators'
import { Role } from '@common/domain/enums'
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
			context.getHandler(),
			context.getClass()
		])

		if (!requiredRoles) {
			return true
		}

		const { user } = context.switchToHttp().getRequest()

		return requiredRoles.some(role => role === user.role)
	}
}
