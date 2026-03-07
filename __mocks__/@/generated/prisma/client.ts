export const mockPrisma = {
	book: {
		findMany: jest.fn(),
		count: jest.fn(),
		create: jest.fn(),
		update: jest.fn(),
		delete: jest.fn(),
	},

	bookCategory: {
		findMany: jest.fn(),
		create: jest.fn(),
		update: jest.fn(),
		delete: jest.fn(),
		findUnique: jest.fn(),
	},

	bookLocation: {
		findMany: jest.fn(),
		create: jest.fn(),
		update: jest.fn(),
		delete: jest.fn(),
		findUnique: jest.fn(),
	},

	admin: {
		findFirst: jest.fn(),
		update: jest.fn(),
	},

	$queryRaw: jest.fn(),
};

export const PrismaClient = jest.fn(() => mockPrisma);

export const Prisma = {
	PrismaClientKnownRequestError: class PrismaClientKnownRequestError extends Error {
		code: string;
		meta?: unknown;

		constructor(message: string, options: { code: string; meta?: unknown }) {
			super(message);
			this.code = options.code;
			this.meta = options.meta;
		}
	},
};
