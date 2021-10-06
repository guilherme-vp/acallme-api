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
		expiresIn: '1d',
		refreshIn: '7d',
		secret: SECRET
	}
}

export default (): AppConfig => config
