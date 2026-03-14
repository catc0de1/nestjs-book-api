import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from '@/modules/auth/auth.module';
import { EnvModule } from '@/core/env.module';
import { LoggerModule } from '@/core/logger.module';
import { throttlerConstant } from '@/modules/auth/throttler/throttler.constant';
import { THROTTLER_ERROR_MSG } from '@/modules/auth/throttler/error-msg.constant';

import type { TestingModule } from '@nestjs/testing';

describe('Throttler (e2e)', () => {
	let app: INestApplication;

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [
				EnvModule,
				LoggerModule,

				ThrottlerModule.forRoot({
					throttlers: [
						{
							name: throttlerConstant.test.name,
							ttl: throttlerConstant.test.ttl,
							limit: throttlerConstant.test.limit,
						},
					],
					errorMessage: THROTTLER_ERROR_MSG,
				}),

				AuthModule,
			],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	afterAll(async () => {
		await app.close();
	});

	it('should throw 429 after limit reached', async () => {
		const server = app.getHttpServer();

		const password = 'wrong-password';

		await request(server).post('/auth/login').send({ password }).expect(401);
		await request(server).post('/auth/login').send({ password }).expect(401);
		await request(server).post('/auth/login').send({ password }).expect(429);
	});
});
