import { Test, TestingModule } from '@nestjs/testing';
import { ServiceUnavailableException } from '@nestjs/common';
import { HealthService } from './health.service';
import { PrismaService } from '@/common/prisma/prisma.service';

import { mockPrisma } from 'mocks/@/generated/prisma/client';

describe('HealthService', () => {
	let service: HealthService;

	beforeEach(async () => {
		jest.clearAllMocks();

		const module: TestingModule = await Test.createTestingModule({
			providers: [HealthService, { provide: PrismaService, useValue: mockPrisma }],
		}).compile();

		service = module.get<HealthService>(HealthService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	// apiCheck
	describe('apiCheck', () => {
		it('should return response of api health', () => {
			const result = service.apiCheck();

			expect(result).toMatchObject({
				status: 'ok',
			});

			expect(result.uptime).toBeDefined();
			expect(result.timestamp).toBeDefined();
		});
	});

	// dbCheck
	describe('dbCheck', () => {
		it('should return response of database health', async () => {
			mockPrisma.$queryRaw.mockResolvedValue([{ result: 1 }]);

			const result = await service.dbCheck();

			expect(result).toMatchObject({
				status: 'ok',
			});
		});

		it('should throw ServiceUnavaibleException when database fails', async () => {
			mockPrisma.$queryRaw.mockRejectedValue(new Error('DB error'));

			const result = service.dbCheck();

			await expect(result).rejects.toThrow(ServiceUnavailableException);
		});
	});
});
