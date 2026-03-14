import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { ADMIN_PASSWORD } from '#/database/constants/admin.constant';

export async function login(app: INestApplication): Promise<string> {
	const res = await request(app.getHttpServer())
		.post('/auth/login')
		.send({ password: ADMIN_PASSWORD });

	const token = res.body.payload;

	return token;
}
