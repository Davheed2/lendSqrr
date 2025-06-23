/** @type {import('ts-jest').JestConfigWithTsJest} **/

import type { Config } from '@jest/types';

// Jest configuration
const config: Config.InitialOptions = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	verbose: true,
	transform: {
		'^.+\\.ts?$': 'ts-jest',
	},
	testMatch: ['**/__tests__/**/*.test.ts', '**/?(*.)+(spec|test).ts'],
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/src/$1',
	},
};

export default config;
