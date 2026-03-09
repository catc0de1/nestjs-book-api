import { ConfigService } from '@nestjs/config';
import { PrismaService } from './prisma.service';

import { mockConfigService } from '@/testing/mocks/configService';

describe('PrismaService', () => {
	let service: PrismaService;

	beforeEach(async () => {
		jest.clearAllMocks();

		service = new PrismaService(mockConfigService as unknown as ConfigService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should set DATABASE_URL from config', () => {
		expect(mockConfigService.get).toHaveBeenCalled();
	});
});
