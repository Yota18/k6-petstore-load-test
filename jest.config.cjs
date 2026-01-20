/** @type {import('jest').Config} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/tests', '<rootDir>/shared'],
    testMatch: ['**/__tests__/**/*.test.ts', '!**/reporter.test.ts', '**/__tests__/**/*.test.js'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
    collectCoverageFrom: [
        'tests/utils/**/*.ts',
        'shared/scripts/**/*.js',
        '!**/*.d.ts',
        '!**/node_modules/**',
        '!**/dist/**',
    ],
    coverageThreshold: {
        global: {
            branches: 70,
            functions: 70,
            lines: 70,
            statements: 70,
        },
    },
    coverageDirectory: 'coverage',
    verbose: true,
};
