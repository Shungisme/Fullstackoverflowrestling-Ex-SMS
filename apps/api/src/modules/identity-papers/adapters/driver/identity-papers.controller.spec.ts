import { Test, TestingModule } from '@nestjs/testing';
import { IdentityPapersController } from './identity-papers.controller';
import { IdentityPapersService } from '../../domain/port/input/identity-papers.service';

describe('IdentityPapersController', () => {
  let controller: IdentityPapersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IdentityPapersController],
      providers: [IdentityPapersService],
    }).compile();

    controller = module.get<IdentityPapersController>(IdentityPapersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
