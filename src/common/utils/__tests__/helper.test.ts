import {
	generateRandom6DigitKey,
	generateRandomBase32,
	generateRandomString,
	generateUniqueTransactionReference,
	parseTokenDuration,
	toJSON,
} from '../helper';

describe('Helper functions', () => {
	describe('generateRandomString', () => {
		it('should generate a random string of 64 characters', () => {
			const result = generateRandomString();
			expect(result).toHaveLength(64);
			expect(result).toMatch(/^[0-9a-f]+$/);
		});
	});

	describe('generateRandomBase32', () => {
		it('should generate a random base32 string of 24 characters', () => {
			const result = generateRandomBase32();
			expect(result).toHaveLength(24);
			expect(result).toMatch(/^[A-Z2-7]+$/);
		});
	});

	describe('generateRandom6DigitKey', () => {
		it('should generate a random 6-digit key', () => {
			const result = generateRandom6DigitKey();
			expect(result).toHaveLength(6);
			expect(parseInt(result)).toBeGreaterThanOrEqual(100000);
			expect(parseInt(result)).toBeLessThanOrEqual(999999);
		});
	});

	describe('parseTokenDuration', () => {
		it('should parse seconds correctly', () => {
			expect(parseTokenDuration('30s')).toBe(30000);
		});

		it('should parse minutes correctly', () => {
			expect(parseTokenDuration('5m')).toBe(300000);
		});

		it('should parse hours correctly', () => {
			expect(parseTokenDuration('2h')).toBe(7200000);
		});

		it('should parse days correctly', () => {
			expect(parseTokenDuration('1d')).toBe(86400000);
		});

		it('should return 0 for invalid input', () => {
			expect(parseTokenDuration('invalid')).toBe(0);
		});
	});

	describe('toJSON', () => {
		it('should exclude specified fields', () => {
			const obj = { a: 1, b: 2, c: 3 };
			const result = toJSON(obj, ['b']);
			expect(result).toEqual({ a: 1, c: 3 });
		});

		it('should return a copy of the object when no fields are excluded', () => {
			const obj = { a: 1, b: 2 };
			const result = toJSON(obj);
			expect(result).toEqual(obj);
			expect(result).not.toBe(obj);
		});
	});

	describe('generateUniqueTransactionReference', () => {
		it('should generate a unique transaction reference', () => {
			const result = generateUniqueTransactionReference();
			expect(result).toMatch(/^TX-\d+-[A-Z0-9]{7}$/);
		});

		it('should generate different references on subsequent calls', () => {
			const result1 = generateUniqueTransactionReference();
			const result2 = generateUniqueTransactionReference();
			expect(result1).not.toBe(result2);
		});
	});
});
