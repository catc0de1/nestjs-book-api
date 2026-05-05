import { z } from 'zod';
import { filterQuery } from '@/common/validators/filter-query.validator';
import { sortQuery } from '@/common/validators/sort-query.validator';
import { clamp } from '@/common/lib/clamp';

export const searchQueryBookSchema = z.strictObject({
	page: z.coerce
		.number()
		.transform((v) => Math.floor(v))
		.transform(clamp(1, Infinity))
		.default(1),
	limit: z.coerce
		.number()
		.transform((v) => Math.floor(v))
		.transform(clamp(1, 100))
		.default(20),

	search: z.string().default(''),

	yearSort: sortQuery,

	bookCategoryFilter: filterQuery,
	bookLocationFilter: filterQuery,
});
export type SearchQueryBookDto = z.infer<typeof searchQueryBookSchema>;
