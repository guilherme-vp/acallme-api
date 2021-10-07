import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common'
import { FastifyRequest, FastifyReply } from 'fastify'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp()
		const response = ctx.getResponse<FastifyReply>()
		const request = ctx.getRequest<FastifyRequest>()
		const status = exception.getStatus()
		const error = exception.getResponse()

		const jsonResponse = {
			status,
			timestamp: new Date().toISOString(),
			path: request.url
		}

		if (typeof error === 'string') {
			return response.status(status).send({
				...jsonResponse,
				error
			})
		}

		const { message } = error as Record<string, any>

		return response.status(status).send({
			...jsonResponse,
			error: message
		})
	}
}
