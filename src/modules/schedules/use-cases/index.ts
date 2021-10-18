import { Provider } from '@nestjs/common'

export * from './create'
export * from './confirm'
export * from './find-by-id'
export * from './find-many'
export * from './find-one'

export const UseCases = Object.values(exports).filter(
	value => typeof value === 'function' && /UseCase/i.test(value.name)
) as Provider[]
