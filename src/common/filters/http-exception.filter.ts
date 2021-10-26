import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common'
import { Request, Response } from 'express'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp()
		const response = ctx.getResponse<Response>()
		const request = ctx.getRequest<Request>()
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
