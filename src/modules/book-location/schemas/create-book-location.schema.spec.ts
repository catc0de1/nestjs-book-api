import { createBookLocationSchema } from './create-book-location.schema';

describe('createBookLocationSchema', () => {
	const validData = {
		name: 'A-10',
	};

	it('should be defined', () => {
		expect(createBookLocationSchema).toBeDefined();
	});

	describe('success cases', () => {
		it('should pass with valid data', () => {
			const result = createBookLocationSchema.safeParse(validData);

			expect(result.success).toBe(true);
		});
	});

	describe('failed cases', () => {
		it('should fail with empty data', () => {
			const result = createBookLocationSchema.safeParse({
				name: '',
			});

			expect(result.success).toBe(false);
		});

		it('should fail with over 50 lenght data', () => {
			const result = createBookLocationSchema.safeParse({
				name: '12345678901234567890123456789012345678901234567890A',
			});

			expect(result.success).toBe(false);
		});
	});
});
