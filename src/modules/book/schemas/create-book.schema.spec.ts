jest.mock('@/common/lib/getTime');

import { createBookSchema } from './create-book.schema';

describe('createBookSchema', () => {
	const validData = {
		title: 'Clean Code',
		author: 'Robert C. Martin',
		year: 2020,
		category: 'Programming',
		bookLocation: 'A-01',
	};

	describe('success cases', () => {
		it('should pass with valid data', () => {
			const result = createBookSchema.safeParse(validData);

			expect(result.success).toBe(true);
		});

		it('should set publisher and description to null by default', () => {
			const result = createBookSchema.parse(validData);

			expect(result.publisher).toBeNull();
			expect(result.description).toBeNull();
		});

		it('should accept nullable publisher and description', () => {
			const result = createBookSchema.safeParse({
				...validData,
				publisher: null,
				description: null,
			});

			expect(result.success).toBe(true);
		});
	});

	describe('title validation', () => {
		it('should fail if title empty', () => {
			const result = createBookSchema.safeParse({
				...validData,
				title: '',
			});

			expect(result.success).toBe(false);
		});
	});

	describe('author validation', () => {
		it('should fail if author empty', () => {
			const result = createBookSchema.safeParse({
				...validData,
				author: '',
			});

			expect(result.success).toBe(false);
		});
	});

	describe('year validation', () => {
		it('should fail if year is not integer', () => {
			const result = createBookSchema.safeParse({
				...validData,
				year: 2020.5,
			});

			expect(result.success).toBe(false);
		});

		it('should fail if year < 1', () => {
			const result = createBookSchema.safeParse({
				...validData,
				year: 0,
			});

			expect(result.success).toBe(false);
		});

		it('should fail if year > getCurrentYear', () => {
			const result = createBookSchema.safeParse({
				...validData,
				year: 2027,
			});

			expect(result.success).toBe(false);
		});
	});

	describe('category validation', () => {
		it('should fail if category empty', () => {
			const result = createBookSchema.safeParse({
				...validData,
				category: '',
			});

			expect(result.success).toBe(false);
		});
	});

	describe('bookLocation validation', () => {
		it('should fail if empty', () => {
			const result = createBookSchema.safeParse({
				...validData,
				bookLocation: '',
			});

			expect(result.success).toBe(false);
		});

		it('should fail if longer than 50 chars', () => {
			const result = createBookSchema.safeParse({
				...validData,
				bookLocation: 'a'.repeat(51),
			});

			expect(result.success).toBe(false);
		});
	});
});
