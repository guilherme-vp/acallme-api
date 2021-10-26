import { pathsToModuleNameMapper } from 'ts-jest/utils'

import { compilerOptions } from './tsconfig.json'

export default {
	preset: 'ts-jest',
	roots: ['<rootDir>/src'],
	coverageDirectory: 'coverage',
	coverageProvider: 'v8',
	testEnvironment: 'node',
	transform: {
		'.+\\.ts$': 'ts-jest'
	},
	collectCoverageFrom: ['**/*.(t|j)s'],
	watchPathIgnorePatterns: ['globalConfig'],
	coveragePathIgnorePatterns: ['node_modules'],
	moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
		prefix: '<rootDir>/src/app'
	})
}
