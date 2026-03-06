jest.mock('@/common/lib/getTime');

import { updateBookSchema } from './update-book.schema';

describe('updateBookSchema', () => {
	const validPartialData = {
		title: 'Updated Title',
	};

	describe('success cases', () => {
		it('should pass with one valid field', () => {
			const result = updateBookSchema.safeParse(validPartialData);
			expect(result.success).toBe(true);
		});

		it('should pass with multiple valid fields', () => {
			const result = updateBookSchema.safeParse({
				title: 'Updated',
				author: 'New Author',
				year: 2020,
			});

			expect(result.success).toBe(true);
		});

		it('should pass with valid year at boundary', () => {
			const result = updateBookSchema.safeParse({
				year: 2025,
			});

			expect(result.success).toBe(true);
		});
	});

	describe('refine validation', () => {
		it('should fail if no fields provided', () => {
			const result = updateBookSchema.safeParse({});
			expect(result.success).toBe(false);

			if (!result.success) {
				expect(result.error.issues[0].message).toBe('At least one field must be provided');
			}
		});
	});

	describe('strict validation', () => {
		it('should fail if unknown field provided', () => {
			const result = updateBookSchema.safeParse({
				unknownField: 'test',
			});

			expect(result.success).toBe(false);
		});
	});

	describe('title validation', () => {
		it('should fail if title empty', () => {
			const result = updateBookSchema.safeParse({
				title: '',
			});

			expect(result.success).toBe(false);
		});
	});

	describe('year validation', () => {
		it('should fail if year not integer', () => {
			const result = updateBookSchema.safeParse({
				year: 2020.5,
			});

			expect(result.success).toBe(false);
		});

		it('should fail if year < 1', () => {
			const result = updateBookSchema.safeParse({
				year: 0,
			});

			expect(result.success).toBe(false);
		});

		it('should fail if year > getCurrentYear', () => {
			const result = updateBookSchema.safeParse({
				year: 2027,
			});

			expect(result.success).toBe(false);
		});
	});

	describe('bookLocation validation', () => {
		it('should fail if empty string', () => {
			const result = updateBookSchema.safeParse({
				bookLocation: '',
			});

			expect(result.success).toBe(false);
		});

		it('should fail if longer than 50 characters', () => {
			const result = updateBookSchema.safeParse({
				bookLocation: 'a'.repeat(51),
			});

			expect(result.success).toBe(false);
		});
	});
});
