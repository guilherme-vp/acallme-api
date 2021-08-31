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

const { secret } = process.env

const config: AppConfig = {
	nest: {
		port: 5005
	},
	security: {
		expiresIn: '15m',
		refreshIn: '7d',
		secret: secret || 'test123'
	}
}

export default (): AppConfig => config
