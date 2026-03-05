export const mockPrisma = {
	book: {
		findMany: jest.fn(),
		count: jest.fn(),
		create: jest.fn(),
		update: jest.fn(),
		delete: jest.fn(),
	},
};

export const PrismaClient = jest.fn(() => mockPrisma);
