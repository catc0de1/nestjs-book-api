import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { Prisma } from '@/generated/prisma/client';

import type { BookCategory } from '@/generated/prisma/client';

@Injectable()
export class BookCategoryService {
	constructor(private readonly prisma: PrismaService) {}

	getAll(): Promise<BookCategory[]> {
		return this.prisma.bookCategory.findMany();
	}

	craete(body: Prisma.BookCategoryCreateInput): Promise<BookCategory> {
		return this.prisma.bookCategory.create({
			data: body,
		});
	}

	update(id: number, body: Prisma.BookCategoryUpdateInput): Promise<BookCategory> {
		return this.prisma.bookCategory.update({
			where: { id },
			data: body,
		});
	}

	async delete(id: number): Promise<BookCategory> {
		const bookCount = await this.prisma.book.count({
			where: { bookCategoryId: id },
		});

		if (bookCount > 0)
			throw new BadRequestException('Cannot delete book category with associated books');

		return this.prisma.bookCategory.delete({
			where: { id },
		});
	}

	findUnique(name: string) {
		return this.prisma.bookCategory.findUnique({
			where: { name },
		});
	}
}
