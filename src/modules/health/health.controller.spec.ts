import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

import type { HealthResponse } from './interfaces/response.interface';

describe('HealthController', () => {
	let controller: HealthController;

	const mockHealthService = {
		apiCheck: jest.fn(),
		dbCheck: jest.fn(),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [HealthController],
			providers: [
				{
					provide: HealthService,
					useValue: mockHealthService,
				},
			],
		}).compile();

		controller = module.get<HealthController>(HealthController);
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	const mockResponse: HealthResponse = {
		status: 'ok',
		uptime: 10,
		timestamp: 'sat06032026',
	};

	// apiCheck
	describe('apiCheck', () => {
		it('should return response of api health', () => {
			mockHealthService.apiCheck.mockReturnValue(mockResponse);

			const result = controller.apiCheck();

			expect(mockHealthService.apiCheck).toHaveBeenCalled();
			expect(result).toEqual(mockResponse);
		});
	});

	// dbCheck
	describe('dbCheck', () => {
		it('should return response of database health', async () => {
			mockHealthService.dbCheck.mockResolvedValue(mockResponse);

			const result = await controller.dbCheck();

			expect(mockHealthService.dbCheck).toHaveBeenCalled();
			expect(result).toEqual(mockResponse);
		});
	});
});
