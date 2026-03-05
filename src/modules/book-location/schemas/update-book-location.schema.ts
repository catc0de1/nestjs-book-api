import { createBookLocationSchema } from './create-book-location.schema';

import type { CreateBookLocationDto } from './create-book-location.schema';

export const updateBookLocationSchema = createBookLocationSchema;
export type UpdateBookLocationDto = CreateBookLocationDto;
