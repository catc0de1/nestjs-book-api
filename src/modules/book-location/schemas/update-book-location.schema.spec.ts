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

	describe('failed cases', () => {
		it('should fail with empty data', () => {
			const result = updateBookLocationSchema.safeParse({
				name: '',
			});

			expect(result.success).toBe(false);
		});

		it('should fail with over 50 lenght data', () => {
			const result = updateBookLocationSchema.safeParse({
				name: '12345678901234567890123456789012345678901234567890A',
			});

			expect(result.success).toBe(false);
		});
	});
});
