import { Test, TestingModule } from '@nestjs/testing';
import { BookLocationService } from './book-location.service';

describe('BookLocationService', () => {
  let service: BookLocationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookLocationService],
    }).compile();

    service = module.get<BookLocationService>(BookLocationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
