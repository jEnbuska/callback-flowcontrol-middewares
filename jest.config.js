module.exports = {
    testEnvironment: 'node',
    rootDir: '.',
    transform: {
        "^.+\\.ts$": "ts-jest"
    },
    testMatch: ["<rootDir>/tests/*test.ts"],
    moduleFileExtensions: [
        "ts",
        "js"
    ],
};
