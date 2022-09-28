module.exports = {
    restoreMocks: true,
    preset: "ts-jest",
    testEnvironment: 'jsdom',
    // testEnvironment: 'node',
    transform: {
        "^.+\\.jsx?$": "babel-jest",
        '^.+\\.tsx?$': 'ts-jest',
    },
    'roots': [
        // '<rootDir>/src/',
        // '<rootDir>/test/',
        '<rootDir>',
    ],
    testMatch: [
        // "<rootDir>/test/**/*(s|S)pec.ts",
        "<rootDir>/test/test.ts",
    ],
};
