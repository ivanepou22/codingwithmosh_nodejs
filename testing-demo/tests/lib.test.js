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

describe('getProduct', () => {
    it('Should return the product with the given id', () => {
        const result = lib.getProduct(1);
        // Too specific
        // expect(result.id).toBe(1);
        // expect(result.price).toBe(10);
        // Proper way
        expect(result).toEqual({ id: 1, price: 10 });
        expect(result).toMatchObject({ id: 1, price: 10 });
        expect(result).toHaveProperty('id', 1);
        expect(result).toHaveProperty('price', 10);
        // Ideal way
        expect(result).toEqual(expect.objectContaining({ id: 1, price: 10 }));
    });
});

describe('registerUser', () => {
    it('Should throw if username is falsy', () => {
        const args = [null, undefined, NaN, '', 0, false];
        args.forEach(a => {
            expect(() => { lib.registerUser(a) }).toThrow();
        });
    });
    it('Should return a user object if valid username is passed', () => {
        const result = lib.registerUser('Ivan');
        expect(result).toMatchObject({ username: 'Ivan' });
        expect(result.id).toBeGreaterThan(0);
    });
});
