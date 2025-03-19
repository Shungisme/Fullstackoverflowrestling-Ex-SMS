import { Test, TestingModule } from '@nestjs/testing';
import { IdentityPapersService } from './identity-papers.service';

describe('IdentityPapersService', () => {
  let service: IdentityPapersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IdentityPapersService],
    }).compile();

    service = module.get<IdentityPapersService>(IdentityPapersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
