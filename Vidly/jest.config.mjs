/** @type {import('jest').Config} */
const config = {
    testEnvironment: 'node',

    // No transform needed because we're using native ESM
    transform: {},

    // IMPORTANT: Remove '.js' from this array (or remove the whole line)
    // extensionsToTreatAsEsm: ['.js'],   ← Delete this line

    // Optional but recommended for cleaner imports
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },

    // Optional: ignore node_modules except for specific packages if needed
    // transformIgnorePatterns: [],
};

export default config;