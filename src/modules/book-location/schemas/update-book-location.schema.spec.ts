import { updateBookLocationSchema } from './update-book-location.schema';

describe('updateBookLocationSchema', () => {
	const validData = {
		name: 'A-10',
	};

	it('should be defined', () => {
		expect(updateBookLocationSchema).toBeDefined();
	});

	describe('success cases', () => {
		it('should pass with valid data', () => {
			const result = updateBookLocationSchema.safeParse(validData);

			expect(result.success).toBe(true);
		});
	});

	describe('fail cases', () => {
		describe('strict validation', () => {
			it('should throw if unknown field provided', () => {
				const result = updateBookLocationSchema.safeParse({
					...validData,
					unknownField: 'test',
				});

				expect(result.success).toBe(false);
			});
		});

		describe('name validation', () => {
			it.each([
				['empty', '', 'Book location is required'],
				['longer than 50 chars', 'a'.repeat(51), 'Book location invalid'],
			])('should throw if name is %s', (_, name, msg) => {
				const result = updateBookLocationSchema.safeParse({
					name,
				});

				expect(result.success).toBe(false);

				if (!result.success) expect(result.error.issues[0].message).toBe(msg);
			});
		});
	});
});
