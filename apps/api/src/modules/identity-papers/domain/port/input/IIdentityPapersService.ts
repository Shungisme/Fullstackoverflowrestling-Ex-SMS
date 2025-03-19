import { PaginatedResponse } from 'src/shared/types/PaginatedResponse';
import { CreateIdentityPaperDTO } from '../../dto/create-identity-paper.dto';
import { IdentityPapersDto } from '../../dto/identity-papers.dto';

export interface IIdentityPapersService {
  create(identityPaper: CreateIdentityPaperDTO): Promise<IdentityPapersDto>;

  update(
    identityPaperId: string,
    data: CreateIdentityPaperDTO,
  ): Promise<IdentityPapersDto>;

  delete(identityPaperId: string): Promise<IdentityPapersDto>;

  findById(identityPaperId: string): Promise<IdentityPapersDto>;

  findAll(
    page: number,
    limit: number,
  ): Promise<PaginatedResponse<IdentityPapersDto>>;

  count(): Promise<number>;
}
