import { Module } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { MeilisearchService } from '@/common/search/meilisearch.service';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

@Module({
	controllers: [HealthController],
	providers: [HealthService, PrismaService, MeilisearchService],
})
export class HealthModule {}
