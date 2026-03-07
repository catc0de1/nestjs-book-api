import { updateBookCategorySchema } from './update-book-category.schema';

describe('updateBookCategorySchema', () => {
	const validData = {
		name: 'Programming',
	};

	it('should be defined', () => {
		expect(updateBookCategorySchema).toBeDefined();
	});

	describe('success cases', () => {
		it('should pass with valid data', () => {
			const result = updateBookCategorySchema.safeParse(validData);

			expect(result.success).toBe(true);
		});
	});

	describe('fail cases', () => {
		describe('strict validation', () => {
			it('should throw if unknown field provided', () => {
				const result = updateBookCategorySchema.safeParse({
					...validData,
					unknownField: 'test',
				});

				expect(result.success).toBe(false);
			});
		});

		describe('name validation', () => {
			it('should throw if name empty', () => {
				const result = updateBookCategorySchema.safeParse({
					name: '',
				});

				expect(result.success).toBe(false);

				const msg = 'Book Category is required';
				if (!result.success) expect(result.error.issues[0].message).toBe(msg);
			});
		});
	});
});
