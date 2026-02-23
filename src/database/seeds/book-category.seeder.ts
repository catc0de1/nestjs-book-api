import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { bookCategoryData } from './data/book-category.data';

@Injectable()
export class BookCategorySeeder {
	constructor(private readonly prisma: PrismaService) {}

	async run(): Promise<void> {
		const count = await this.prisma.bookCategory.count();

		if (count > 0) {
			console.log('Book Categories already exist, skipping seed');
			return;
		}

		await this.prisma.bookCategory.createMany({ data: bookCategoryData });

		console.log('Book Categories seeded successfully');
	}
}
