module.exports = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/lib/(.*)$': '<rootDir>/lib/$1',
    '^@/app/(.*)$': '<rootDir>/app/$1',
    '^@/hooks/(.*)$': '<rootDir>/hooks/$1'
  },
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'ts-jest'
  },
  testPathIgnorePatterns: ['<rootDir>/node_modules/']
}
