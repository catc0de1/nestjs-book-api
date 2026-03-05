import { z } from 'zod';
import { getCurrentYear } from '@/common/lib/getTime';

export const createBookSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	author: z.string().min(1, 'Author is required'),
	year: z
		.number()
		.int()
		.min(1, 'Year invalid')
		.max(getCurrentYear, `Year cannot be greater than ${getCurrentYear}`),
	publisher: z.string().nullable().optional().default(null),
	description: z.string().nullable().optional().default(null),
	category: z.string().min(1, 'Book category is required'),
	bookLocation: z.string().min(1, 'Book location is required').max(50, 'Book location invalid'),
});
export type CreateBookDto = z.infer<typeof createBookSchema>;
