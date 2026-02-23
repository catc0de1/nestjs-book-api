import { PrismaService } from '@/common/prisma/prisma.service';
import { Module } from '@nestjs/common';
import { EnvModule } from '@/core/env.module';
import { LoggerModule } from '@/core/logger.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { SeederService } from './seeds/seeder.service';
import { AdminSeeder } from './seeds/admin.seeder';
import { BookLocationSeeder } from './seeds/book-location.seeder';
import { BookCategorySeeder } from './seeds/book-category.seeder';
import { BookSeeder } from './seeds/book.seeder';

@Module({
	imports: [EnvModule, LoggerModule, AuthModule],
	providers: [
		PrismaService,
		AdminSeeder,
		BookCategorySeeder,
		BookLocationSeeder,
		BookSeeder,
		SeederService,
	],
})
export class SeedModule {}
