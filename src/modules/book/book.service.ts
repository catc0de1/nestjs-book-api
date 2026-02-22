import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { Prisma } from '@/generated/prisma/client';
import { BookCategoryService } from '@/modules/book-category/book-category.service';
import { BookLocationService } from '@/modules/book-location/book-location.service';

import type { Book } from '@/generated/prisma/client';
import type { CreateBookDto, GetAllQueryBookDto, UpdateBookDto } from './book.validator';

@Injectable()
export class BookService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly bookCategoryService: BookCategoryService,
		private readonly bookLocationService: BookLocationService,
	) {}

	async getAll(query?: GetAllQueryBookDto) {
		const page = query?.page ?? 1;
		const limit = query?.limit ?? 10;

		const orderBy: Prisma.BookOrderByWithRelationInput[] = [];

		if (query?.createdAtSort) orderBy.push({ createdAt: query.createdAtSort });
		if (query?.titleSort) orderBy.push({ title: query.titleSort });
		if (query?.authorSort) orderBy.push({ author: query.authorSort });
		if (query?.yearSort) orderBy.push({ year: query.yearSort });
		if (query?.publisherSort) orderBy.push({ publisher: query.publisherSort });
		if (query?.categorySort) orderBy.push({ bookCategory: { name: query.categorySort } });
		if (query?.bookLocationSort) orderBy.push({ bookLocation: { name: query.bookLocationSort } });

		if (orderBy.length === 0) {
			orderBy.push({ createdAt: 'desc' });
		}

		const where: Prisma.BookWhereInput = {};

		if (query?.titleFilter) {
			where.title = { contains: query.titleFilter, mode: 'insensitive' };
		}

		if (query?.bookCategoryFilter) {
			where.bookCategory = {
				name: {
					contains: query.bookCategoryFilter,
					mode: 'insensitive',
				},
			};
		}

		if (query?.bookLocationFilter) {
			where.bookLocation = {
				name: {
					contains: query.bookLocationFilter,
					mode: 'insensitive',
				},
			};
		}

		const [books, total] = await Promise.all([
			this.prisma.book.findMany({
				where,
				include: {
					bookCategory: true,
					bookLocation: true,
				},
				orderBy,
				skip: (page - 1) * limit,
				take: limit,
			}),
			this.prisma.book.count({ where }),
		]);

		const totalPages = Math.ceil(total / limit);

		return {
			meta: {
				total,
				page,
				limit,
				totalPages,
			},
			data: books,
		};
	}

	async create(body: CreateBookDto): Promise<Book> {
		const category = await this.bookCategoryService.findUnique(body.category);
		if (!category) throw new NotFoundException('Book Category does not exist');

		const location = await this.bookLocationService.findUnique(body.bookLocation);
		if (!location) throw new NotFoundException('Book Location does not exist');

		return this.prisma.book.create({
			data: {
				title: body.title,
				author: body.author,
				year: body.year,
				publisher: body.publisher,
				description: body.description,
				bookCategory: {
					connect: {
						name: body.category,
					},
				},
				bookLocation: {
					connect: {
						name: body.bookLocation,
					},
				},
			},
		});
	}

	async update(id: number, body: UpdateBookDto): Promise<Book> {
		if (body.category) {
			const category = await this.bookCategoryService.findUnique(body.category);

			if (!category) throw new NotFoundException('Book category does not exist');
		}

		if (body.bookLocation) {
			const bookLocation = await this.bookLocationService.findUnique(body.bookLocation);

			if (!bookLocation) throw new NotFoundException('Book location does not exist');
		}

		return this.prisma.book.update({
			where: { id },
			data: {
				...(body.title && { title: body.title }),
				...(body.author && { author: body.author }),
				...(body.year && { year: body.year }),
				...(body.publisher !== undefined && { publisher: body.publisher }),
				...(body.description !== undefined && { description: body.publisher }),
				...(body.category && {
					bookCategory: {
						connect: {
							name: body.category,
						},
					},
				}),
				...(body.bookLocation && {
					bookLocation: {
						connect: {
							name: body.bookLocation,
						},
					},
				}),
			},
		});
	}

	delete(id: number): Promise<Book> {
		return this.prisma.book.delete({
			where: { id },
		});
	}
}
