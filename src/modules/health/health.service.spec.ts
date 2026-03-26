import { Test, TestingModule } from '@nestjs/testing';
import { ServiceUnavailableException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { MeilisearchService } from '@/common/search/meilisearch.service';
import { HealthService } from './health.service';

import { mockPrisma } from 'mocks/@/generated/prisma/client';
import { mockMeilisearchService } from '@/testing/mocks/meilisearch.service';

describe('HealthService', () => {
	let service: HealthService;

	beforeEach(async () => {
		jest.clearAllMocks();

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				HealthService,
				{
					provide: PrismaService,
					useValue: mockPrisma,
				},
				{
					provide: MeilisearchService,
					useValue: mockMeilisearchService,
				},
			],
		}).compile();

		service = module.get<HealthService>(HealthService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('success cases', () => {
		// api check
		describe('apiCheck', () => {
			it('should return response of api health', () => {
				const result = service.apiCheck();

				expect(result).toMatchObject({
					status: 'ok',
				});

				expect(result.uptime).toBeDefined();
				expect(typeof result.uptime).toBe('number');
				expect(result.uptime).toBeGreaterThanOrEqual(0);

				expect(result.timestamp).toBeDefined();
				expect(typeof result.timestamp).toBe('string');
				expect(new Date(result.timestamp)).toBeInstanceOf(Date);

				expect(result.message).toBeUndefined();
			});
		});

		// db check
		describe('dbCheck', () => {
			it('should return response of database health', async () => {
				mockPrisma.$queryRaw.mockResolvedValue([{ result: 1 }]);

				const result = await service.dbCheck();

				expect(mockPrisma.$queryRaw).toHaveBeenCalled();
				expect(result).toMatchObject({
					status: 'ok',
				});

				expect(result.uptime).toBeDefined();
				expect(typeof result.uptime).toBe('number');
				expect(result.uptime).toBeGreaterThanOrEqual(0);

				expect(result.timestamp).toBeDefined();
				expect(typeof result.timestamp).toBe('string');
				expect(new Date(result.timestamp)).toBeInstanceOf(Date);

				expect(result.message).toBeUndefined();
			});
		});

		// search check
		describe('searchCheck', () => {
			it('should return response of search engine health', async () => {
				const healthMock = jest.fn().mockResolvedValue({ status: 'ok' });

				mockMeilisearchService.getClient.mockReturnValue({
					health: healthMock,
				});

				const result = await service.searchCheck();

				expect(healthMock).toHaveBeenCalled();
				expect(result).toMatchObject({
					status: 'ok',
				});
				expect(result.message).toBe('ok');

				expect(result.uptime).toBeDefined();
				expect(typeof result.uptime).toBe('number');
				expect(result.uptime).toBeGreaterThanOrEqual(0);

				expect(result.timestamp).toBeDefined();
				expect(typeof result.timestamp).toBe('string');
				expect(new Date(result.timestamp)).toBeInstanceOf(Date);
			});
		});

		// search stats
		describe('searchStats', () => {
			it('should return search engine stats', async () => {
				const mockStats = { databaseSize: 12345, indexes: [] };
				mockMeilisearchService.getStats.mockResolvedValue(mockStats);

				const result = await service.searchStats();

				expect(mockMeilisearchService.getStats).toHaveBeenCalled();
				expect(result).toBe(mockStats);
			});
		});
	});

	describe('fail cases', () => {
		// db check
		describe('dbCheck', () => {
			it('should throw ServiceUnavaibleException when database fails', async () => {
				mockPrisma.$queryRaw.mockRejectedValue(new Error('DB error'));

				const result = service.dbCheck();

				expect(mockPrisma.$queryRaw).toHaveBeenCalled();

				await expect(result).rejects.toThrow(ServiceUnavailableException);
				await expect(result).rejects.toMatchObject({
					response: {
						message: 'Database not reachable',
					},
				});
			});
		});

		// search check
		describe('searchCheck', () => {
			it('should throw ServiceUnavaibleException when search engine fails', async () => {
				const healthMock = jest.fn().mockRejectedValue(new Error('Search error'));

				mockMeilisearchService.getClient.mockReturnValue({
					health: healthMock,
				});

				const result = service.searchCheck();

				expect(healthMock).toHaveBeenCalled();
				await expect(result).rejects.toThrow(ServiceUnavailableException);
				await expect(result).rejects.toMatchObject({
					response: {
						message: 'Meilisearch not reachable: Search error',
					},
				});
			});
		});
	});
});
