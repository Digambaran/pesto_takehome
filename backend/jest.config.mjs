/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {},
  globals: { 'ts-jest': { diagnostics: false } }
};