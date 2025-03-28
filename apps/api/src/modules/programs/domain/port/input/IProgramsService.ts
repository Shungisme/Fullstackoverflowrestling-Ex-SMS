import { PaginatedResponse } from 'src/shared/types/PaginatedResponse';
import { CreateProgramDTO } from '../../dto/create-program.dto';
import { ProgramsDto } from '../../dto/programs.dto';
import { UpdateProgramDTO } from '../../dto/update-program.dto';

export interface IProgramsService {
  create(program: CreateProgramDTO): Promise<ProgramsDto>;

  update(programId: string, data: UpdateProgramDTO): Promise<ProgramsDto>;

  delete(programId: string): Promise<ProgramsDto>;

  findById(programId: string): Promise<ProgramsDto>;

  findAll(
    page: number,
    limit: number,
    status: string,
  ): Promise<PaginatedResponse<ProgramsDto>>;

  count(whereOptions: any): Promise<number>;
}
