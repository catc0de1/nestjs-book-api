import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from './auth.guard';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

describe('AuthGuard', () => {
	let guard: AuthGuard;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthGuard,
				{
					provide: Reflector,
					useValue: {
						getAllAndOverride: jest.fn(),
					},
				},
				{
					provide: JwtService,
					useValue: {
						verifyAsync: jest.fn(),
					},
				},
			],
		}).compile();

		guard = module.get<AuthGuard>(AuthGuard);
	});

	it('should be defined', () => {
		expect(guard).toBeDefined();
	});
});
