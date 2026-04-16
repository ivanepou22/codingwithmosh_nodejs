const exercise1 = require('../exercise1');

describe('FizzBuzz', () => {
    it('Should throw if value is not a number', () => {
        expect(() => exercise1.fizzBuzz('v')).toThrow();
    });

    it('Should return FizzBuzz if the input is divisible by 3 and 5', () => {
        const result = exercise1.fizzBuzz(15);
        expect(result).toBe('FizzBuzz');
    });

    it('Should return Fizz if the input is divisible by 3', () => {
        const result = exercise1.fizzBuzz(6);
        expect(result).toBe('Fizz');
    })

    it('Should return Buzz if the input is divisible by 5', () => {
        const result = exercise1.fizzBuzz(10);
        expect(result).toBe('Buzz');
    })

    it('Should return the input if the input is either not divisible by 3 or 5', () => {
        const result = exercise1.fizzBuzz(4);
        expect(result).toBe(4);
    })
});