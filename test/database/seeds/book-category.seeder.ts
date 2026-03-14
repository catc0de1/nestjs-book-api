import { PrismaClient } from '@/generated/prisma/client';
import { bookCategoryData } from '@/database/seeds/data/book-category.data';

export async function bookCategorySeeder(prisma: PrismaClient): Promise<void> {
	await prisma.bookCategory.createMany({
		data: bookCategoryData,
	});

	return;
}
