import { z } from 'zod';

export const createBookLocationSchema = z.object({
	name: z.string().min(1, 'Book location is required').max(50, 'Book location invalid'),
});
export type CreateBookLocationDto = z.infer<typeof createBookLocationSchema>;
