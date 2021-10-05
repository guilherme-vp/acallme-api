import { ConnectionAttributes } from 'oracledb'

type Envs = 'development' | 'production'

const { NODE_ENV: ProcessEnv, DATABASE_USER, DATABASE_PASS, DATABASE_URI, SECRET } = process.env

const NODE_ENV: Envs = (ProcessEnv as Envs) || 'development'

const dbConfig: ConnectionAttributes = {
	user: DATABASE_USER ?? 'oracle',
	password: DATABASE_PASS ?? 'oracle',
	connectionString: DATABASE_URI ?? 'localhost:1521/ORCLCDB.localdomain'
}

export { NODE_ENV, dbConfig, SECRET }
