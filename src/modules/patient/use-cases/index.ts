import { Provider } from '@nestjs/common'

export * from './use-cases.service'

export const UseCases = Object.keys(exports).filter(
	value => typeof value === 'function' && /UseCase/i.test(value)
) as unknown as Provider[]
