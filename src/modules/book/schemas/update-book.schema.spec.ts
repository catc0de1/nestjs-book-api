import { updateBookSchema } from './update-book.schema';

import { getCurrentYear } from 'mocks/@/common/lib/getTime';

describe('updateBookSchema', () => {
	it('should be defined', () => {
		expect(updateBookSchema).toBeDefined();
	});

	describe('success cases', () => {
		it('should pass with one valid field', () => {
			const result = updateBookSchema.safeParse({
				title: 'Updated',
			});

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

		it('should pass nullable publisher and description', () => {
			const result = updateBookSchema.safeParse({
				publisher: null,
				description: null,
			});

			expect(result.success).toBe(true);
		});

		it('should set publisher and description to null if empty string', () => {
			const result = updateBookSchema.parse({
				publisher: '',
				description: '',
			});

			expect(result.publisher).toBeNull();
			expect(result.description).toBeNull();
		});
	});

	describe('fail cases', () => {
		describe('refine validation', () => {
			it('should throw if no fields provided', () => {
				const result = updateBookSchema.safeParse({});
				expect(result.success).toBe(false);

				const msg = 'At least one field must be provided';
				if (!result.success) expect(result.error.issues[0].message).toBe(msg);
			});
		});

		describe('strict validation', () => {
			it('should throw if unknown field provided', () => {
				const result = updateBookSchema.safeParse({
					unknownField: 'test',
				});

				expect(result.success).toBe(false);
			});
		});

		describe('title validation', () => {
			it('should throw if title provided but empty', () => {
				const result = updateBookSchema.safeParse({
					title: '',
				});

				expect(result.success).toBe(false);

				const msg = 'Provided Title cannot empty';
				if (!result.success) expect(result.error.issues[0].message).toBe(msg);
			});
		});

		describe('author validation', () => {
			it('should throw if author provided but empty', () => {
				const result = updateBookSchema.safeParse({
					author: '',
				});

				expect(result.success).toBe(false);

				const msg = 'Provided Author cannot empty';
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
				const result = updateBookSchema.safeParse({
					year,
				});

				expect(result.success).toBe(false);

				if (msg !== null && !result.success) expect(result.error.issues[0].message).toBe(msg);
			});
		});

		describe('category validation', () => {
			it('should throw if category provided but empty', () => {
				const result = updateBookSchema.safeParse({
					category: '',
				});

				expect(result.success).toBe(false);

				const msg = 'Provided Book Category cannot empty';
				if (!result.success) expect(result.error.issues[0].message).toBe(msg);
			});
		});

		describe('bookLocation validation', () => {
			it.each([
				['empty', '', 'Provided Book Location cannot empty'],
				['longer than 50 chars', 'a'.repeat(51), 'Book Location invalid'],
			])('should throw if bookLocation is %s', (_, bookLocation, msg) => {
				const result = updateBookSchema.safeParse({
					bookLocation,
				});

				expect(result.success).toBe(false);

				if (!result.success) expect(result.error.issues[0].message).toBe(msg);
			});
		});
	});
});
