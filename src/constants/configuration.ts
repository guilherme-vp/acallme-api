export const GRAPHQL_PATH = '/graphql'
export const AUTH_HEADER = 'authorization'
const SECRET = process.env.SECRET || 'secret123'
const NODE_ENV = process.env.NODE_ENV || 'development'
const IN_PROD = NODE_ENV === 'staging'

const APOLLO_OPTIONS = {
	endpoint: '/graphql',
	subscriptions: '/graphql',
	playground: '/graphql',
	cors: {
		origin: '*'
	},
	debug: IN_PROD ? false : true
}

export { APOLLO_OPTIONS, SECRET, IN_PROD, NODE_ENV }
