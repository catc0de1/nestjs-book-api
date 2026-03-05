export const mockPrisma = {
	book: {
		findMany: jest.fn(),
		count: jest.fn(),
		create: jest.fn(),
		update: jest.fn(),
		delete: jest.fn(),
	},
};

export const PrismaService = jest.fn(() => mockPrisma);
