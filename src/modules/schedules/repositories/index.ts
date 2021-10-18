import { Provider } from '@nestjs/common'

export * from './schedule.repository'

export const Repositories = Object.values(exports).filter(
	value => typeof value === 'function' && /Repository/i.test(value.name)
) as Provider[]
