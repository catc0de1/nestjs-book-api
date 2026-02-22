import { Module } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { BookLocationController } from './book-location.controller';
import { BookLocationService } from './book-location.service';

@Module({
	controllers: [BookLocationController],
	providers: [PrismaService, BookLocationService],
	exports: [BookLocationService],
})
export class BookLocationModule {}
