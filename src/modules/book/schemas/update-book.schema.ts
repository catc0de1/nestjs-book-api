import { z } from 'zod';
import { getCurrentYear } from '@/common/lib/getTime';

export const updateBookSchema = z
	.object({
		title: z.string().min(1).optional(),
		author: z.string().min(1).optional(),
		year: z
			.number()
			.int()
			.positive()
			.min(1, 'Year invalid')
			.max(getCurrentYear, `Year cannot be greater than ${getCurrentYear}`)
			.optional(),
		publisher: z.string().optional(),
		description: z.string().optional(),
		category: z.string().min(1).optional(),
		bookLocation: z.string().min(1).max(50, 'Book location invalid').optional(),
	})
	.strict()
	.refine((data) => Object.keys(data).length > 0, 'At least one field must be provided');
export type UpdateBookDto = z.infer<typeof updateBookSchema>;
