const lib = require('../lib');
// test('absolute - should return a positive number if the input is positive', () => {
//     const result = lib.absolute(5);
//     expect(result).toBe(5);
// });

// test('absolute - should return a positive number if the input is negative', () => {
//     const result = lib.absolute(-5);
//     expect(result).toBe(5);
// });
// test('absolute - should return a positive number if the input is zero', () => {
//     const result = lib.absolute(0);
//     expect(result).toBe(0);
// });

describe('absolute', () => {
    it('Should return a positive number if the input is positive', () => {
        const result = lib.absolute(5);
        expect(result).toBe(5);
    });
    it('Should return a positive number if the input is negative', () => {
        const result = lib.absolute(-5);
        expect(result).toBe(5);
    });
    it('Should return a positive number if the input is zero', () => {
        const result = lib.absolute(0);
        expect(result).toBe(0);
    });
});
