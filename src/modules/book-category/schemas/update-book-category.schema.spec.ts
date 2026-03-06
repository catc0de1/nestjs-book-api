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

	describe('failed cases', () => {
		it('should pass with empty data', () => {
			const result = updateBookCategorySchema.safeParse({
				name: '',
			});

			expect(result.success).toBe(false);
		});
	});
});
