import { PrismaClient } from '@/generated/prisma/client';
import { bookLocationData } from '@/database/seeds/data/book-location.data';

export async function bookLocationSeeder(prisma: PrismaClient): Promise<void> {
	await prisma.bookLocation.createMany({
		data: bookLocationData,
	});

	return;
}
