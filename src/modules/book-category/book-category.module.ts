import { Module } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { BookCategoryController } from './book-category.controller';
import { BookCategoryService } from './book-category.service';

@Module({
	controllers: [BookCategoryController],
	providers: [PrismaService, BookCategoryService],
	exports: [BookCategoryService],
})
export class BookCategoryModule {}
