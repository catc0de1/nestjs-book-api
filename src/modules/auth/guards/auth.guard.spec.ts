import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { PinoLogger } from 'nestjs-pino';

import { mockLogger } from '@/testing/mocks/logger';

describe('AuthGuard', () => {
	let guard: AuthGuard;
	let reflector: Reflector;
	let jwtService: JwtService;

	const createMockContext = (request: any): ExecutionContext =>
		({
			switchToHttp: () => ({
				getRequest: () => request,
			}),
			getHandler: jest.fn(),
			getClass: jest.fn(),
		}) as unknown as ExecutionContext;

	beforeEach(async () => {
		jest.clearAllMocks();

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
				{
					provide: PinoLogger,
					useValue: mockLogger,
				},
			],
		}).compile();

		guard = module.get<AuthGuard>(AuthGuard);
		reflector = module.get<Reflector>(Reflector);
		jwtService = module.get<JwtService>(JwtService);
	});

	it('should be defined', () => {
		expect(guard).toBeDefined();
	});

	describe('canActivate', () => {
		it('should allow public route', async () => {
			jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);

			const ctx = createMockContext({});

			const result = await guard.canActivate(ctx);

			expect(result).toBe(true);
		});

		it('should allow non protected method (GET)', async () => {
			jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);

			const ctx = createMockContext({
				method: 'GET',
				headers: {},
			});

			const result = await guard.canActivate(ctx);

			expect(result).toBe(true);
		});

		it('should throw if token missing', async () => {
			jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);

			const ctx = createMockContext({
				method: 'POST',
				headers: {},
			});

			await expect(guard.canActivate(ctx)).rejects.toThrow(
				new UnauthorizedException('Missing token'),
			);

			expect(mockLogger.warn).toHaveBeenCalled();
		});

		it('should throw if authorization not bearer', async () => {
			jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);

			const ctx = createMockContext({
				method: 'POST',
				headers: {
					authorization: 'Basic token',
				},
			});

			await expect(guard.canActivate(ctx)).rejects.toThrow(
				new UnauthorizedException('Missing token'),
			);
		});

		it('should allow request if token valid', async () => {
			jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);

			const payload = { sub: 1 };

			jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue(payload);

			const request: any = {
				method: 'POST',
				headers: {
					authorization: 'Bearer validtoken',
				},
			};

			const ctx = createMockContext(request);

			const result = await guard.canActivate(ctx);

			expect(jwtService.verifyAsync).toHaveBeenCalledWith('validtoken');
			expect(request.user).toEqual(payload);
			expect(result).toBe(true);
		});

		it('should throw if token invalid', async () => {
			jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);

			jest.spyOn(jwtService, 'verifyAsync').mockRejectedValue(new Error('invalid token'));

			const ctx = createMockContext({
				method: 'POST',
				headers: {
					authorization: 'Bearer invalidtoken',
				},
			});

			await expect(guard.canActivate(ctx)).rejects.toThrow(
				new UnauthorizedException('Invalid token'),
			);

			expect(mockLogger.warn).toHaveBeenCalled();
		});
	});
});
