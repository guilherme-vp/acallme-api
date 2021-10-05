import { Provider } from '@nestjs/common'

export * from './sign-up'
export * from './find-by-id'

export const UseCases = Object.values(exports).filter(
	value => typeof value === 'function' && /UseCase/i.test(value.name)
) as Provider[]
