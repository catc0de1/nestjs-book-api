import { z } from 'zod';

export const sortQuery = z.preprocess(
	(v) => (v === 'asc' || v === 'desc' ? v : null),
	z.enum(['asc', 'desc']).nullable().default(null),
);
