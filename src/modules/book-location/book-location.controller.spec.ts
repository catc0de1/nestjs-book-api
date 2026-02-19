import { Test, TestingModule } from '@nestjs/testing';
import { BookLocationController } from './book-location.controller';

describe('BookLocationController', () => {
  let controller: BookLocationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookLocationController],
    }).compile();

    controller = module.get<BookLocationController>(BookLocationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
