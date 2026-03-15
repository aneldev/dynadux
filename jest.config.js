module.exports = {
  setupFilesAfterEnv: ["./jest.setup.ts"],
  automock: false,
  collectCoverage: false,
  testEnvironment: "jest-environment-node",
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.jest.json",
        diagnostics: {
          warnOnly: true,  // Set to true to avoid breaking the test run, but still see the diagnostics
        },
      },
    ],
  },
  transformIgnorePatterns: ["/node_modules/", "\\.pnp\\.[^\\/]+$"],
  testRegex: "(src)/.*\\.(test|spec)\\.(ts|tsx)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  moduleNameMapper: {
    "\\.(css|less|scss|jpg|png|svg|gif)$": "identity-obj-proxy",
  },
  coverageDirectory: "coverage",
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/@types",
    "!src/**/*.d.ts",
    "!src/index.ts",
    "!src/index.tsx",
    "!src/*/index.ts",
    "!src/*/index.tsx"
  ],
};
