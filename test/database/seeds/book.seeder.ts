import { PrismaClient } from '@/generated/prisma/client';
import { bookData } from './data/book.data';

export async function bookSeeder(prisma: PrismaClient): Promise<void> {
	for (const book of bookData) {
		await prisma.book.create({
			data: {
				title: book.title,
				author: book.author,
				year: book.year,
				publisher: book.publisher,
				description: book.description,
				bookCategory: {
					connect: {
						name: book.bookCategory.name,
					},
				},
				bookLocation: {
					connect: {
						name: book.bookLocation.name,
					},
				},
			},
		});
	}
}
