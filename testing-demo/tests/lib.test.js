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

describe('greet', () => {
    it('Should return the greeting message', () => {
        const result = lib.greet('Ivan');
        expect(result).toMatch(/Ivan/);
    });
});

describe('getCurrencies', () => {
    it('Should return supported currencies', () => {
        const result = lib.getCurrencies();
        // Too general
        // expect(result).toBeDefined();
        // expect(result).not.toBeNull();
        // Too specific
        // expect(result[0]).toBe('USD');
        // expect(result[1]).toBe('AUD');
        // expect(result[2]).toBe('EUR');

        // // Proper way        expect(result).toContain('USD');
        // expect(result).toContain('AUD');
        // expect(result).toContain('EUR');

        // Ideal way
        expect(result).toEqual(expect.arrayContaining(['USD', 'AUD', 'EUR']));
    });
});
