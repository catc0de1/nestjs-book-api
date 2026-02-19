import { Module } from '@nestjs/common';
import { EnvModule } from './core/env.module';
import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { BookModule } from './modules/book/book.module';
import { BookLocationModule } from './modules/book-location/book-location.module';
import { BookCategoryModule } from './modules/book-category/book-category.module';

@Module({
	imports: [
		EnvModule,

		HealthModule,
		AuthModule,
		BookModule,
		BookLocationModule,
		BookCategoryModule,
	],
})
export class AppModule {}
