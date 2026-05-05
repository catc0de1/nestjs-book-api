import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { bookCategoryData } from './data/book-category.data';

@Injectable()
export class BookCategorySeeder {
	private readonly logger = new Logger(BookCategorySeeder.name);

	constructor(private readonly prisma: PrismaService) {}

	async run(): Promise<void> {
		const count = await this.prisma.bookCategory.count();

		if (count > 0) {
			this.logger.log('Book Categories already exist, skipping seed');
			return;
		}

		await this.prisma.bookCategory.createMany({ data: bookCategoryData });

		this.logger.log('Book Categories seeded successfully');
	}
}
