import { z } from 'zod';
import { emptyStringToNull } from '@/common/validators/empty-string-to-null.validator';
import { getCurrentYear } from '@/common/lib/getTime';

export const updateBookSchema = z
	.strictObject({
		title: z.string().min(1, 'Provided Title cannot empty').optional(),
		author: z.string().min(1, 'Provided Author cannot empty').optional(),
		year: z
			.number()
			.int()
			.min(1, 'Year invalid')
			.max(getCurrentYear, `Year cannot be greater than ${getCurrentYear}`)
			.optional(),
		publisher: emptyStringToNull.optional(),
		description: emptyStringToNull.optional(),
		category: z.string().min(1, 'Provided Book Category cannot empty').optional(),
		bookLocation: z
			.string()
			.min(1, 'Provided Book Location cannot empty')
			.max(50, 'Book Location invalid')
			.optional(),
	})
	.refine((data) => Object.keys(data).length > 0, 'At least one field must be provided');
export type UpdateBookDto = z.infer<typeof updateBookSchema>;
