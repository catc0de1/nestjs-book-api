import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/common/prisma/prisma.service';
import { Prisma } from '@/generated/prisma/client';
import { generateBook } from './factories/book.factory';

@Injectable()
export class BookSeeder {
	constructor(
		private readonly prisma: PrismaService,
		private readonly configService: ConfigService,
	) {}

	async run(total: number = 50): Promise<void> {
		const NODE_ENV = this.configService.get<string>('NODE_ENV');

		if (NODE_ENV === 'production') {
			console.log('Environment is production, skipping books seed');
			return;
		}

		const count = await this.prisma.book.count();

		if (count > 0) {
			console.log('Books already exist, skipping seed');
			return;
		}

		await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
			const [bookCategories, bookLocations] = await Promise.all([
				await tx.bookCategory.findMany(),
				await tx.bookLocation.findMany(),
			]);

			const bookCategoryMap = new Map(bookCategories.map((c) => [c.name, c.id]));
			const bookLocationMap = new Map(bookLocations.map((l) => [l.name, l.id]));

			for (let i = 0; i < total; i++) {
				const item = generateBook();

				await tx.book.create({
					data: {
						title: item.title,
						author: item.author,
						year: item.year,
						publisher: item.publisher,
						description: item.description,
						bookCategory: {
							connect: { id: bookCategoryMap.get(item.bookCategory.name) },
						},
						bookLocation: {
							connect: { id: bookLocationMap.get(item.bookLocation.name) },
						},
					},
				});
			}
		});

		console.log('Books seeded successfully');
	}
}
