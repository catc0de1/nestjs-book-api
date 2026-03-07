import { createBookCategorySchema } from './create-book-category.schema';

describe('createBookCategorySchema', () => {
	const validData = {
		name: 'Programming',
	};

	it('should be defined', () => {
		expect(createBookCategorySchema).toBeDefined();
	});

	describe('success cases', () => {
		it('should pass with valid data', () => {
			const result = createBookCategorySchema.safeParse(validData);

			expect(result.success).toBe(true);
		});
	});

	describe('fail cases', () => {
		describe('strict validation', () => {
			it('should throw if unknown field provided', () => {
				const result = createBookCategorySchema.safeParse({
					unknownField: 'test',
				});

				expect(result.success).toBe(false);
			});
		});

		describe('name validation', () => {
			it('should throw name if empty', () => {
				const result = createBookCategorySchema.safeParse({
					name: '',
				});

				expect(result.success).toBe(false);

				const msg = 'Book Category is required';
				if (!result.success) expect(result.error.issues[0].message).toBe(msg);
			});
		});
	});
});
