import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

describe('HealthController', () => {
	let controller: HealthController;

	const mockHealthService = {
		apiCheck: jest.fn(),
		dbCheck: jest.fn(),
		searchCheck: jest.fn(),
		searchStats: jest.fn(),
	};

	beforeEach(async () => {
		jest.clearAllMocks();

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
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	const mockResponse = {
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

	// searchCheck
	describe('searchCheck', () => {
		it('should return response of search engine health', async () => {
			mockHealthService.searchCheck.mockResolvedValue(mockResponse);

			const result = await controller.searchCheck();

			expect(mockHealthService.searchCheck).toHaveBeenCalled();
			expect(result).toEqual(mockResponse);
		});
	});

	// searchStats
	describe('searchStats', () => {
		it('should return response of search engine stats', async () => {
			mockHealthService.searchStats.mockResolvedValue(mockResponse);

			const result = await controller.searchStats();

			expect(mockHealthService.searchStats).toHaveBeenCalled();
			expect(result).toEqual(mockResponse);
		});
	});
});
