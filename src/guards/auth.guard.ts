import { UserToken } from '@domain/base'
import {
	Injectable,
	CanActivate,
	ExecutionContext,
	UnauthorizedException
} from '@nestjs/common'
import { decode } from 'jsonwebtoken'
import { Observable } from 'rxjs'

@Injectable()
export class AuthGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const request = context.switchToHttp().getRequest()

		const token = request.headers['authorization'] as string

		const user = decode(token?.split(' ')[1]) as unknown as UserToken

		if (!user) throw new UnauthorizedException()

		return true
	}
}
