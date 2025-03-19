import { Test, TestingModule } from '@nestjs/testing';
import { StatusesController } from './statuses.controller';
import { StatusesService } from '../../domain/port/input/statuses.service';

describe('StatusesController', () => {
  let controller: StatusesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatusesController],
      providers: [StatusesService],
    }).compile();

    controller = module.get<StatusesController>(StatusesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
