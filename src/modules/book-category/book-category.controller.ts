import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Post,
	Put,
	UsePipes,
} from '@nestjs/common';
import { ZodValidationPipe } from '@/common/pipes/zod.pipe';
import { BookCategoryService } from './book-category.service';
import { createBookCategorySchema, updateBookCategorySchema } from './book-category.validator';

import type { BookCategory } from '@/generated/prisma/client';
import type { CreateBookCategoryDto, UpdateBookCategoryDto } from './book-category.validator';
import type { MessageResponse } from '@/common/interfaces/response.interface';
import type { CreatedResponse, UpdatedResponse } from './interfaces/response.interface';

@Controller('book-category')
export class BookCategoryController {
	constructor(private readonly bookCategoryService: BookCategoryService) {}

	@Get()
	getAll(): Promise<BookCategory[]> {
		return this.bookCategoryService.getAll();
	}

	@Post()
	@UsePipes(new ZodValidationPipe(createBookCategorySchema))
	async create(@Body() body: CreateBookCategoryDto): Promise<CreatedResponse> {
		const bookCategory = await this.bookCategoryService.create(body);

		return {
			message: 'Book Category created successfully',
			data: bookCategory,
		};
	}

	@Put(':id')
	async update(
		@Param('id', ParseIntPipe) id: number,
		@Body(new ZodValidationPipe(updateBookCategorySchema)) body: UpdateBookCategoryDto,
	): Promise<UpdatedResponse> {
		const bookCategory = await this.bookCategoryService.update(id, body);

		return {
			message: 'Book Category updated successfully',
			data: bookCategory,
		};
	}

	@Delete(':id')
	async delete(@Param('id', ParseIntPipe) id: number): Promise<MessageResponse> {
		const deletedBookCategory = await this.bookCategoryService.delete(id);

		return {
			message: `Book Category ${deletedBookCategory.name} deleted successfully`,
		};
	}
}
