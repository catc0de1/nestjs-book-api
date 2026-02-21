import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { Prisma } from '@/generated/prisma/client';

import type { BookLocation } from '@/generated/prisma/client';

@Injectable()
export class BookLocationService {
	constructor(private readonly prisma: PrismaService) {}

	getAll(): Promise<BookLocation[]> {
		return this.prisma.bookLocation.findMany();
	}

	create(body: Prisma.BookLocationCreateInput): Promise<BookLocation> {
		return this.prisma.bookLocation.create({
			data: body,
		});
	}

	update(id: number, body: Prisma.BookLocationUpdateInput): Promise<BookLocation> {
		return this.prisma.bookLocation.update({
			where: { id },
			data: body,
		});
	}

	async delete(id: number): Promise<BookLocation> {
		const bookCount = await this.prisma.book.count({
			where: { bookLocationId: id },
		});

		if (bookCount > 0)
			throw new BadRequestException('Cannot delete book location with associated books');

		return this.prisma.bookLocation.delete({
			where: { id },
		});
	}

	findUnique(name: string) {
		return this.prisma.bookLocation.findUnique({
			where: { name },
		});
	}
}
