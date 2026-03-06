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

	$queryRaw: jest.fn(),
};

export const PrismaClient = jest.fn(() => mockPrisma);
