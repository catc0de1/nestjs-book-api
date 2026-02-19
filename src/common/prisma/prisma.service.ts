import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@/generated/prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
	constructor(configService: ConfigService) {
		const DATABASE_URL = configService.get<string>('DATABASE_URL');
		const adapter = new PrismaPg({ connectionString: DATABASE_URL });
		super({ adapter });
	}
}
