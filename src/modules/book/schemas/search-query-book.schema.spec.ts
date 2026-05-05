import { searchQueryBookSchema } from './search-query-book.schema';

describe('searchQueryBookSchema', () => {
	it('should be defined', () => {
		expect(searchQueryBookSchema).toBeDefined();
	});

	describe('success cases', () => {
		// pagination validation
		describe('pagination validation', () => {
			it('should pass page and limit with number value', () => {
				const result = searchQueryBookSchema.safeParse({
					page: 2,
					limit: 15,
				});

				expect(result.success).toBe(true);
			});

			it('should pass page and limit with string number value', () => {
				const result = searchQueryBookSchema.safeParse({
					page: '2',
					limit: '15',
				});

				expect(result.success).toBe(true);
			});

			it('should set page and limit to default value', () => {
				const result = searchQueryBookSchema.parse({});

				expect(result.page).toBe(1);
				expect(result.limit).toBe(20);
			});

			it('should set page and limit string value to number', () => {
				const result = searchQueryBookSchema.parse({
					page: '2',
					limit: '20',
				});

				expect(result.page).toBe(2);
				expect(result.limit).toBe(20);
			});

			it('should set page and limit to rounded down if decimal', () => {
				const result = searchQueryBookSchema.parse({
					page: 2.5,
					limit: 12.5,
				});

				expect(result.page).toBe(2);
				expect(result.limit).toBe(12);
			});

			it('should set page and limit to default minimum if value is lower', () => {
				const result = searchQueryBookSchema.parse({
					page: 0,
					limit: 0,
				});

				expect(result.page).toBe(1);
				expect(result.limit).toBe(1);
			});

			it('should set limit to default maximum if value is higher', () => {
				const result = searchQueryBookSchema.parse({
					limit: 101,
				});

				expect(result.limit).toBe(100);
			});
		});

		// sort validation
		const sortFields = ['yearSort'] as const;

		describe('sort validation', () => {
			it.each(sortFields)('should pass valid enum values for %s', (field) => {
				const result = searchQueryBookSchema.safeParse({
					[field]: 'asc',
				});

				expect(result.success).toBe(true);
			});

			it.each(sortFields)('should pass null value for %s', (field) => {
				const result = searchQueryBookSchema.safeParse({
					[field]: null,
				});

				expect(result.success).toBe(true);
			});

			it.each(sortFields)('should set to null if enum value is invalid for %s', (field) => {
				const result = searchQueryBookSchema.parse({
					[field]: 'invalid',
				});

				expect(result[field]).toBeNull();
			});

			it.each(sortFields)('should set to null if empty for %s', (field) => {
				const result = searchQueryBookSchema.parse({});

				expect(result[field]).toBeNull();
			});
		});

		// filter validation
		const filterFields = ['bookCategoryFilter', 'bookLocationFilter'] as const;

		describe('filter validation', () => {
			it.each(filterFields)('should pass valid string value for %s', (field) => {
				const result = searchQueryBookSchema.safeParse({
					[field]: 'test',
				});

				expect(result.success).toBe(true);
			});

			it.each(filterFields)('should pass null value for %s', (field) => {
				const result = searchQueryBookSchema.safeParse({
					[field]: null,
				});

				expect(result.success).toBe(true);
			});

			it.each(filterFields)('should set to null if empty for %s', (field) => {
				const result = searchQueryBookSchema.parse({});

				expect(result[field]).toBeNull();
			});
		});
	});

	describe('fail cases', () => {
		describe('strict validation', () => {
			it('should throw if unknown field provided', () => {
				const result = searchQueryBookSchema.safeParse({
					unknownField: 'test',
				});

				expect(result.success).toBe(false);
			});
		});

		describe('pagination validation', () => {
			it('should throw if page and limit value is a string', () => {
				const result = searchQueryBookSchema.safeParse({
					page: 'string',
					limit: 'string',
				});

				expect(result.success).toBe(false);
			});
		});
	});
});
