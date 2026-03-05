import { createBookCategorySchema } from './create-book-category.schema';

import type { CreateBookCategoryDto } from './create-book-category.schema';

export const updateBookCategorySchema = createBookCategorySchema;
export type UpdateBookCategoryDto = CreateBookCategoryDto;
