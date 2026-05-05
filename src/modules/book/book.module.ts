import { Module } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { BookCategoryModule } from '@/modules/book-category/book-category.module';
import { BookLocationModule } from '@/modules/book-location/book-location.module';

@Module({
	imports: [BookCategoryModule, BookLocationModule],
	controllers: [BookController],
	providers: [PrismaService, BookService],
})
export class BookModule {}
