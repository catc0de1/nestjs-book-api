import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { bookLocationData } from './data/book-location.data';

@Injectable()
export class BookLocationSeeder {
	constructor(private readonly prisma: PrismaService) {}

	async run(): Promise<void> {
		const count = await this.prisma.bookLocation.count();

		if (count > 0) {
			console.log('Book Locations already exist, skipping seed');
			return;
		}

		await this.prisma.bookLocation.createMany({ data: bookLocationData });

		console.log('Book Locations seeded successfully');
	}
}
