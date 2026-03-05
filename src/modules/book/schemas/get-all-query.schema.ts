import { z } from 'zod';

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
