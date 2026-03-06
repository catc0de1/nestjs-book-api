import { mockPrisma } from 'mocks/@/generated/prisma/client';

export const PrismaService = jest.fn(() => mockPrisma);
