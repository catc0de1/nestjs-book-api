import { PinoLogger } from 'nestjs-pino';
import { BaseService } from './base.service';

import { mockLogger } from '@/testing/mocks/logger';

class TestService extends BaseService {}

describe('BaseService', () => {
	let service: TestService;

	beforeEach(async () => {
		jest.clearAllMocks();

		service = new TestService(mockLogger as unknown as PinoLogger);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should set logger context to class name', () => {
		expect(mockLogger.setContext).toHaveBeenCalledWith('TestService');
	});
});
