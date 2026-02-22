import { z } from 'zod';

const currentYear = new Date().getFullYear();

export const createBookSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	author: z.string().min(1, 'Author is required'),
	year: z
		.number()
		.int()
		.min(1, 'Year invalid')
		.max(currentYear, `Year cannot be greater than ${currentYear}`),
	publisher: z.string().nullable().optional().default(null),
	description: z.string().nullable().optional().default(null),
	category: z.string().min(1, 'Book category is required'),
	bookLocation: z.string().min(1, 'Book location is required').max(50, 'Book location invalid'),
});
export type CreateBookDto = z.infer<typeof createBookSchema>;

export const updateBookSchema = z
	.object({
		title: z.string().min(1).optional(),
		author: z.string().min(1).optional(),
		year: z
			.number()
			.int()
			.positive()
			.min(1, 'Year invalid')
			.max(currentYear, `Year cannot be greater than ${currentYear}`)
			.optional(),
		publisher: z.string().optional(),
		description: z.string().optional(),
		category: z.string().min(1).optional(),
		bookLocation: z.string().min(1).max(50, 'Book location invalid').optional(),
	})
	.strict()
	.refine((data) => Object.keys(data).length > 0, 'At least one field must be provided');
export type UpdateBookDto = z.infer<typeof updateBookSchema>;

export const getAllQueryBookSchema = z.object({
	page: z.coerce.number().int().positive().min(1).default(1),
	limit: z.coerce.number().int().positive().min(1).max(100).default(10),

	createdAtSort: z.enum(['asc', 'desc']).nullable().default(null),
	titleSort: z.enum(['asc', 'desc']).nullable().default(null),
	authorSort: z.enum(['asc', 'desc']).nullable().default(null),
	yearSort: z.enum(['asc', 'desc']).nullable().default(null),
	publisherSort: z.enum(['asc', 'desc']).nullable().default(null),
	categorySort: z.enum(['asc', 'desc']).nullable().default(null),
	bookLocationSort: z.enum(['asc', 'desc']).nullable().default(null),

	bookCategoryFilter: z.string().nullable().default(null),
	bookLocationFilter: z.string().nullable().default(null),
	titleFilter: z.string().nullable().default(null),
});
export type GetAllQueryBookDto = z.infer<typeof getAllQueryBookSchema>;
