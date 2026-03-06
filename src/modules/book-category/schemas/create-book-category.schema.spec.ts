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

	describe('failed cases', () => {
		it('should pass with empty data', () => {
			const result = createBookCategorySchema.safeParse({
				name: '',
			});

			expect(result.success).toBe(false);
		});
	});
});
