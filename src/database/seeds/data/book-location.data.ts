export type BookLocationData = {
	name: string;
};

export const bookLocationData: BookLocationData[] = [
	{ name: 'A-01' },
	{ name: 'A-02' },
	{ name: 'A-03' },
	{ name: 'B-01' },
	{ name: 'B-02' },
] as const;
