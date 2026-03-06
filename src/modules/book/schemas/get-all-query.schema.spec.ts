import { getAllQueryBookSchema } from './get-all-query.schema';

describe('getAllQueryBookSchema', () => {
	describe('default values', () => {
		it('should set default page and limit', () => {
			const result = getAllQueryBookSchema.parse({});

			expect(result.page).toBe(1);
			expect(result.limit).toBe(10);
		});
	});

	describe('coercion behavior', () => {
		it('should convert string to number', () => {
			const result = getAllQueryBookSchema.parse({
				page: '2',
				limit: '20',
			});

			expect(result.page).toBe(2);
			expect(result.limit).toBe(20);
		});
	});

	// page & limit validation
	describe('page validation', () => {
		it.each([
			{ page: 0 },
			{ page: -1 },
			{ page: 1.5 },
		])('should fail for invalid page: %o', (query) => {
			const result = getAllQueryBookSchema.safeParse(query);
			expect(result.success).toBe(false);
		});
	});

	describe('limit validation', () => {
		it.each([
			{ limit: 0 },
			{ limit: -10 },
			{ limit: 101 },
			{ limit: 1.5 },
		])('should fail for invalid limit: %o', (query) => {
			const result = getAllQueryBookSchema.safeParse(query);
			expect(result.success).toBe(false);
		});
	});

	// sort validation
	const sortFields = [
		'createdAtSort',
		'titleSort',
		'authorSort',
		'yearSort',
		'publisherSort',
		'categorySort',
		'bookLocationSort',
	] as const;

	describe('sort validation', () => {
		it.each(sortFields)('should accept valid enum values for %s', (field) => {
			const result = getAllQueryBookSchema.safeParse({
				[field]: 'asc',
			});

			expect(result.success).toBe(true);
		});

		it.each(sortFields)('should reject invalid enum value for %s', (field) => {
			const result = getAllQueryBookSchema.safeParse({
				[field]: 'invalid',
			});

			expect(result.success).toBe(false);
		});

		it.each(sortFields)('should default to null for %s', (field) => {
			const result = getAllQueryBookSchema.parse({});
			expect(result[field]).toBeNull();
		});
	});

	// filter validation
	const filterFields = ['bookCategoryFilter', 'bookLocationFilter', 'titleFilter'] as const;

	describe('filter validation', () => {
		it.each(filterFields)('should accept string value for %s', (field) => {
			const result = getAllQueryBookSchema.safeParse({
				[field]: 'test',
			});

			expect(result.success).toBe(true);
		});

		it.each(filterFields)('should accept null value for %s', (field) => {
			const result = getAllQueryBookSchema.safeParse({
				[field]: null,
			});

			expect(result.success).toBe(true);
		});

		it.each(filterFields)('should default to null for %s', (field) => {
			const result = getAllQueryBookSchema.parse({});
			expect(result[field]).toBeNull();
		});
	});
});
