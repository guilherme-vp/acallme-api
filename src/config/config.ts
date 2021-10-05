import { SECRET } from '@constants/configuration'

export interface AppConfig {
	nest: NestConfig
	security: SecurityConfig
}

export interface NestConfig {
	port: number
}

export interface SecurityConfig {
	expiresIn: string
	refreshIn: string
	secret: string
}

const config: AppConfig = {
	nest: {
		port: 5005
	},
	security: {
		expiresIn: '15m',
		refreshIn: '7d',
		secret: SECRET || 'test123'
	}
}

export default (): AppConfig => config
