import { Provider } from '@nestjs/common'

export * from './patient'
export * from './specialist'

export const Repositories = Object.values(exports).filter(
	value => typeof value === 'function' && /Repository/i.test(value.name)
) as Provider[]
