import { NestFactory } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { PrismaExceptionFilter } from './config/filters/prisma-exception.filter';
import { AppModule } from './app.module';

import type { NestFastifyApplication } from '@nestjs/platform-fastify';

async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>(
		AppModule,
		new FastifyAdapter({
			logger: true,
		}),
	);

	app.setGlobalPrefix('api');

	app.useGlobalFilters(new PrismaExceptionFilter());

	await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
