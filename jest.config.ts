import type { Config } from '@jest/types'
// import { pathsToModuleNameMapper } from 'ts-jest/utils'
// import { compilerOptions } from './tsconfig.json'

// const moduleNameMapper = pathsToModuleNameMapper(compilerOptions.paths, {
// 	prefix: '<rootDir>/src'
// })

export default {
	roots: ['<rootDir>/src'],
	preset: 'ts-jest',
	transform: {
		'.+\\.ts$': 'ts-jest'
	},
	testEnvironment: 'node',
	collectCoverage: true,
	coverageDirectory: './coverage',
	clearMocks: true,
	cache: true,
	// moduleNameMapper
} as Config.InitialOptions
