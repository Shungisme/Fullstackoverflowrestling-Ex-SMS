import { PaginatedResponse } from 'src/shared/types/PaginatedResponse';
import { CreateSemesterDTO } from '../../dto/create-semester.dto';
import { SemesterDto } from '../../dto/semester.dto';
import { UpdateSemesterDTO } from '../../dto/update-semester.dto';

export interface ISemesterService {
  create(semester: CreateSemesterDTO): Promise<SemesterDto>;

  update(semesterId: string, data: UpdateSemesterDTO): Promise<SemesterDto>;

  delete(semesterId: string): Promise<SemesterDto>;

  findById(semesterId: string): Promise<SemesterDto>;

  findAll(page: number, limit: number): Promise<PaginatedResponse<SemesterDto>>;

  count(whereOptions: any): Promise<number>;
}
