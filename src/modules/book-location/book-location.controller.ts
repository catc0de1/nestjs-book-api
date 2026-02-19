import { Controller } from '@nestjs/common';
import { BookLocationService } from './book-location.service';

@Controller('book-location')
export class BookLocationController {
	constructor(private readonly bookLocationservice: BookLocationService) {}
}
