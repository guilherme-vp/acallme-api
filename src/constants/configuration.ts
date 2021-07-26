type Envs = 'development' | 'production'

const AUTH_HEADER: string = 'authorization'
const SECRET: string = process.env.SECRET || 'secret123'
const NODE_ENV: Envs = process.env.NODE_ENV as Envs || 'development'

export { SECRET, NODE_ENV, AUTH_HEADER }
