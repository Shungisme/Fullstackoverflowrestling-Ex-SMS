import { PaginatedResponse } from 'src/shared/types/PaginatedResponse';
import { CreateProgramDTO } from '../../dto/create-program.dto';
import { ProgramsDto } from '../../dto/programs.dto';

export interface IProgramsService {
  create(program: CreateProgramDTO): Promise<ProgramsDto>;

  update(programId: string, data: CreateProgramDTO): Promise<ProgramsDto>;

  delete(programId: string): Promise<ProgramsDto>;

  findById(programId: string): Promise<ProgramsDto>;

  findAll(page: number, limit: number): Promise<PaginatedResponse<ProgramsDto>>;

  count(): Promise<number>;
}
