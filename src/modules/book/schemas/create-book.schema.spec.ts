import { createBookSchema } from './create-book.schema';

import { getCurrentYear } from 'mocks/@/common/lib/getTime';

describe('createBookSchema', () => {
	const validData = {
		title: 'Clean Code',
		author: 'Robert C. Martin',
		year: 2020,
		category: 'Programming',
		bookLocation: 'A-01',
	};

	it('should be defined', () => {
		expect(createBookSchema).toBeDefined();
	});

	describe('success cases', () => {
		it('should pass with valid data', () => {
			const result = createBookSchema.safeParse(validData);

			expect(result.success).toBe(true);
		});

		it('should pass string publisher and description', () => {
			const result = createBookSchema.safeParse({
				...validData,
				publisher: 'meow',
				description: 'how to write meow language',
			});

			expect(result.success).toBe(true);
		});

		it('should pass nullable publisher and description', () => {
			const result = createBookSchema.safeParse({
				...validData,
				publisher: null,
				description: null,
			});

			expect(result.success).toBe(true);
		});

		it('should set publisher and description to null by default', () => {
			const result = createBookSchema.parse(validData);

			expect(result.publisher).toBeNull();
			expect(result.description).toBeNull();
		});
	});

	describe('fail cases', () => {
		describe('strict validation', () => {
			it('should throw if unknown field provided', () => {
				const result = createBookSchema.safeParse({
					...validData,
					unknownField: 'test',
				});

				expect(result.success).toBe(false);
			});
		});

		describe('title validation', () => {
			it('should throw if title empty', () => {
				const result = createBookSchema.safeParse({
					...validData,
					title: '',
				});

				expect(result.success).toBe(false);

				const msg = 'Title is required';
				if (!result.success) expect(result.error.issues[0].message).toBe(msg);
			});
		});

		describe('author validation', () => {
			it('should throw if author empty', () => {
				const result = createBookSchema.safeParse({
					...validData,
					author: '',
				});

				expect(result.success).toBe(false);

				const msg = 'Author is required';
				if (!result.success) expect(result.error.issues[0].message).toBe(msg);
			});
		});

		describe('year validation', () => {
			it.each([
				['is string number', '2025', null],
				['is decimal', 2025.5, null],
				['is less than 1', 0, 'Year invalid'],
				['is greater than current year', 2030, `Year cannot be greater than ${getCurrentYear}`],
			])('should throw if year %s', (_, year, msg) => {
				const result = createBookSchema.safeParse({
					...validData,
					year,
				});

				expect(result.success).toBe(false);

				if (msg !== null && !result.success) expect(result.error.issues[0].message).toBe(msg);
			});
		});

		describe('category validation', () => {
			it('should throw if category empty', () => {
				const result = createBookSchema.safeParse({
					...validData,
					category: '',
				});

				expect(result.success).toBe(false);

				const msg = 'Book Category is required';
				if (!result.success) expect(result.error.issues[0].message).toBe(msg);
			});
		});

		describe('bookLocation validation', () => {
			it.each([
				['empty', '', 'Book Location is required'],
				['longer than 50 chars', 'a'.repeat(51), 'Book Location invalid'],
			])('should throw if bookLocation is %s', (_, bookLocation, msg) => {
				const result = createBookSchema.safeParse({
					...validData,
					bookLocation,
				});

				expect(result.success).toBe(false);

				if (!result.success) expect(result.error.issues[0].message).toBe(msg);
			});
		});
	});
});
