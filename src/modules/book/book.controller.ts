import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	Query,
} from '@nestjs/common';
import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe';
import { BookService } from './book.service';
import { createBookSchema } from './schemas/create-book.schema';
import { getAllQueryBookSchema } from './schemas/get-all-query-book.schema';
import { updateBookSchema } from './schemas/update-book.schema';

import type { CreateBookDto } from './schemas/create-book.schema';
import type { GetAllQueryBookDto } from './schemas/get-all-query-book.schema';
import type { UpdateBookDto } from './schemas/update-book.schema';
import type {
	CreatedResponse,
	DeletedResponse,
	PaginatedResponse,
	UpdatedResponse,
} from './interfaces/response.interface';

@Controller('book')
export class BookController {
	constructor(private readonly bookService: BookService) {}

	@Get()
	getAll(
		@Query(new ZodValidationPipe(getAllQueryBookSchema)) query: GetAllQueryBookDto,
	): Promise<PaginatedResponse> {
		return this.bookService.getAll(query);
	}

	@Post()
	async create(
		@Body(new ZodValidationPipe(createBookSchema)) body: CreateBookDto,
	): Promise<CreatedResponse> {
		const book = await this.bookService.create(body);

		return {
			message: 'Book created successfully',
			data: book,
		};
	}

	@Patch(':id')
	async update(
		@Param('id', ParseIntPipe) id: number,
		@Body(new ZodValidationPipe(updateBookSchema)) body: UpdateBookDto,
	): Promise<UpdatedResponse> {
		const book = await this.bookService.update(id, body);

		return {
			message: 'Book updated successfully',
			data: book,
		};
	}

	@Delete(':id')
	async delete(@Param('id', ParseIntPipe) id: number): Promise<DeletedResponse> {
		const deletedBook = await this.bookService.delete(id);

		return {
			message: `Book ${deletedBook.title} deleted successfully`,
		};
	}
}
