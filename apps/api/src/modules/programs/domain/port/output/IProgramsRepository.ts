import { CreateProgramDTO } from '../../dto/create-program.dto';
import { ProgramsDto } from '../../dto/programs.dto';
import { UpdateProgramDTO } from '../../dto/update-program.dto';

export interface IProgramsRepository {
  create(program: CreateProgramDTO): Promise<ProgramsDto>;

  update(programId: string, data: UpdateProgramDTO): Promise<ProgramsDto>;

  delete(programId: string): Promise<ProgramsDto>;

  findById(programId: string): Promise<ProgramsDto>;

  findByName(programName: string): Promise<ProgramsDto>;

  findAll(page: number, limit: number, status: string): Promise<ProgramsDto[]>;

  count(whereOptions: any): Promise<number>;
}

export const PROGRAM_REPOSITORY = Symbol('IProgramsRepository');
