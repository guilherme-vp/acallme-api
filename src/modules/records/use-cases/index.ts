import { Provider } from '@nestjs/common'

export * from './create'
export * from './find-by-id'

export const UseCases = Object.values(exports).filter(
	value => typeof value === 'function' && /UseCase/i.test(value.name)
) as Provider[]
