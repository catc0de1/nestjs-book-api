import { BadRequestException } from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from './zod-validation.pipe';

describe('ZodValidationPipe', () => {
	let pipe: ZodValidationPipe;

	const mockSchema = z.object({
		title: z.string(),
		year: z.number().int().min(1),
	});

	beforeEach(() => {
		jest.clearAllMocks();

		pipe = new ZodValidationPipe(mockSchema);
	});

	it('should be defined', () => {
		expect(pipe).toBeDefined();
	});

	describe('success cases', () => {
		it('should return parsed data if validation passes', () => {
			const value = { title: 'Clean Code', year: 2026 };

			const result = pipe.transform(value, {} as any);

			expect(result).toEqual(value);
		});
	});

	describe('fail cases', () => {
		it('should throw if validation fails', () => {
			const value = { title: 123, year: 2026.3 };

			try {
				pipe.transform(value, {} as any);
			} catch (err) {
				const exception = err as BadRequestException;
				const response = exception.getResponse() as any;

				expect(response.message).toBe('Validation failed');
				expect(response.errors).toEqual(
					expect.arrayContaining([
						expect.objectContaining({
							path: expect.any(String),
							message: expect.any(String),
						}),
					]),
				);
			}
		});
	});
});
