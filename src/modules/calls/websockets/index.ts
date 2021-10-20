import { Provider } from '@nestjs/common'

export * from './video-call.gateway'

export const Gateways = Object.values(exports).filter(
	value => typeof value === 'function' && /Gateway/i.test(value.name)
) as Provider[]
