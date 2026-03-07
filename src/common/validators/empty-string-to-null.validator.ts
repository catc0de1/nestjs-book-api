import { z } from 'zod';

export const emptyStringToNull = z.preprocess((v) => (v === '' ? null : v), z.string().nullable());
