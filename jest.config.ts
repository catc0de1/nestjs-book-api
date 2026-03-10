export default {
	moduleFileExtensions: ['js', 'json', 'ts'],
	rootDir: '.',
	testRegex: '.*\\.spec\\.ts$',
	transform: {
		'^.+\\.(t|j)s$': '@swc/jest',
	},
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/src/$1',
		'^mocks/(.*)$': '<rootDir>/__mocks__/$1',
	},
	testEnvironment: 'node',
};
