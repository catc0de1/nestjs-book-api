import { Controller } from '@nestjs/common';
import { BookCategoryService } from './book-category.service';

@Controller('book-category')
export class BookCategoryController {
	constructor(private readonly bookCategoryService: BookCategoryService) {}
}
