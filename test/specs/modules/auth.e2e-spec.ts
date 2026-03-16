import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { CoreModule } from '@/core/core.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { PrismaService } from '@/common/prisma/prisma.service';
import { adminSeeder } from '#/database/seeds/admin.seeder';
import { trucateDatabase } from '#/database/truncate';
import { ADMIN_PASSWORD } from '#/database/constants/admin.constant';
import { login } from '#/helper/auth.helper';

import type { App } from 'supertest/types';
import type { TestingModule } from '@nestjs/testing';

describe('AuthModule (e2e)', () => {
	let app: INestApplication<App>;
	let prisma: PrismaService;

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [CoreModule, AuthModule],
		})
			.overrideGuard(ThrottlerGuard)
			.useValue({
				canActive: () => true,
			})
			.compile();

		app = moduleFixture.createNestApplication();

		prisma = moduleFixture.get(PrismaService);

		app.setGlobalPrefix('api');

		await app.init();
	});

	beforeEach(async () => {
		await trucateDatabase(prisma);
		await adminSeeder(prisma);
	});

	afterAll(async () => {
		await prisma.$disconnect();
		await app.close();
	});

	describe('success cases', () => {
		describe('POST /api/auth/login', () => {
			it('should login successfully', async () => {
				const res = await request(app.getHttpServer())
					.post('/api/auth/login')
					.send({
						password: ADMIN_PASSWORD,
					})
					.expect(201);

				expect(res.body.message).toBe('Login successfully');
				expect(res.body.payload).toBeDefined();
			});
		});

		describe('POST /api/auth/change-password', () => {
			it('should change password successfully', async () => {
				const token = await login(app);

				await request(app.getHttpServer())
					.post('/api/auth/change-password')
					.set('Authorization', `Bearer ${token}`)
					.send({
						oldPassword: ADMIN_PASSWORD,
						newPassword: 'newPassword123',
					})
					.expect(201);

				const admin = await prisma.admin.findFirst();

				expect(admin).toBeDefined();
			});
		});

		describe('POST /api/auth/logout', () => {
			it('should logout successfully', async () => {
				const token = await login(app);

				const res = await request(app.getHttpServer())
					.post('/api/auth/logout')
					.set('Authorization', `Bearer ${token}`)
					.expect(201);

				expect(res.body.message).toBe('Logout successfully');
			});
		});
	});

	describe('fail cases', () => {
		describe('POST /api/auth/login', () => {
			const route = '/api/auth/login';

			it('should throw if password incorrect', async () => {
				await request(app.getHttpServer())
					.post(route)
					.send({
						password: 'wrong-password',
					})
					.expect(401);
			});

			it('should throw if validation fail', async () => {
				await request(app.getHttpServer())
					.post(route)
					.send({
						password: '',
					})
					.expect(400);
			});
		});

		describe('POST /api/auth/change-password', () => {
			const route = '/api/auth/change-password';

			it('should throw if old password incorrect', async () => {
				const token = await login(app);

				await request(app.getHttpServer())
					.post(route)
					.set('Authorization', `Bearer ${token}`)
					.send({
						oldPassword: 'wrongPassword',
						newPassword: 'newPassword123',
					})
					.expect(401);
			});

			it('should throw if bearer authorization not set', async () => {
				await request(app.getHttpServer())
					.post(route)
					.send({
						oldPassword: ADMIN_PASSWORD,
						newPassword: 'newPassword123',
					})
					.expect(401);
			});

			it('should throw if bearer token incorrect', async () => {
				await request(app.getHttpServer())
					.post(route)
					.set('Authorization', `Bearer wrongtoken`)
					.send({
						oldPassword: ADMIN_PASSWORD,
						newPassword: 'newPassword123',
					})
					.expect(401);
			});

			it('should throw if validation fail', async () => {
				const token = await login(app);

				await request(app.getHttpServer())
					.post(route)
					.set('Authorization', `Bearer ${token}`)
					.send({
						oldPassword: ADMIN_PASSWORD,
						newPassword: 'password',
					})
					.expect(400);
			});
		});
	});
});
