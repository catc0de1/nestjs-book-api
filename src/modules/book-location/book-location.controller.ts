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
import { BookLocationService } from './book-location.service';
import { createBookLocationSchema, updateBookLocationSchema } from './book-location.validator';

import type { BookLocation } from '@/generated/prisma/client';
import type { CreateBookLocationDto, UpdateBookLocationDto } from './book-location.validator';
import type { MessageResponse } from '@/common/interfaces/response.interface';
import type { CreatedResponse, UpdatedResponse } from './interfaces/response.interface';

@Controller('book-location')
export class BookLocationController {
	constructor(private readonly bookLocationservice: BookLocationService) {}

	@Get()
	getAll(): Promise<BookLocation[]> {
		return this.bookLocationservice.getAll();
	}

	@Post()
	@UsePipes(new ZodValidationPipe(createBookLocationSchema))
	async create(@Body() body: CreateBookLocationDto): Promise<CreatedResponse> {
		const bookLocation = await this.bookLocationservice.create(body);

		return {
			message: 'Book Location created successfully',
			data: bookLocation,
		};
	}

	@Put(':id')
	async update(
		@Param('id', ParseIntPipe) id: number,
		@Body(new ZodValidationPipe(updateBookLocationSchema)) body: UpdateBookLocationDto,
	): Promise<UpdatedResponse> {
		const bookLocation = await this.bookLocationservice.update(id, body);

		return {
			message: `Book Location updated successfully`,
			data: bookLocation,
		};
	}

	@Delete(':id')
	async delete(@Param('id', ParseIntPipe) id: number): Promise<MessageResponse> {
		const bookLocation = await this.bookLocationservice.delete(id);

		return {
			message: `Book location ${bookLocation.name} deleted successfully`,
		};
	}
}
