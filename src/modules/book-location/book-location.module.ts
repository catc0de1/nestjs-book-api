import { Module } from '@nestjs/common';
import { BookLocationController } from './book-location.controller';
import { BookLocationService } from './book-location.service';

@Module({
  controllers: [BookLocationController],
  providers: [BookLocationService]
})
export class BookLocationModule {}
