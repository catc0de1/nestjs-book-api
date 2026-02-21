import { z } from 'zod';

export const createBookCategorySchema = z.object({
	name: z.string().min(1, 'Book Category is required'),
});
export type CreateBookCategoryDto = z.infer<typeof createBookCategorySchema>;

export const updateBookCategorySchema = createBookCategorySchema;
export type UpdateBookCategoryDto = CreateBookCategoryDto;
