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
import { ZodValidationPipe } from '@/common/pipes/zod.pipe';
import { BookService } from './book.service';
import { createBookSchema, getAllQueryBookSchema, updateBookSchema } from './book.validator';

import type { CreateBookDto, GetAllQueryBookDto, UpdateBookDto } from './book.validator';
import type { MessageResponse } from '@/common/interfaces/response.interface';
import type {
	CreatedResponse,
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
	async delete(@Param('id', ParseIntPipe) id: number): Promise<MessageResponse> {
		const deletedBook = await this.bookService.delete(id);

		return {
			message: `Book ${deletedBook.title} deleted successfully`,
		};
	}
}
