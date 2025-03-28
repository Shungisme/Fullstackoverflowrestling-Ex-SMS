import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/database/prisma.service';
import { IProgramsRepository } from '../../domain/port/output/IProgramsRepository';
import { ProgramsDto } from '../../domain/dto/programs.dto';
import { CreateProgramDTO } from '../../domain/dto/create-program.dto';
import { UpdateProgramDTO } from '../../domain/dto/update-program.dto';

@Injectable()
export class ProgramsRepository implements IProgramsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async count(): Promise<number> {
    return await this.prismaService.program.count();
  }

  async create(program: CreateProgramDTO): Promise<ProgramsDto> {
    const createdProgram = await this.prismaService.program.create({
      data: program,
    });
    return {
      ...createdProgram,
      status: createdProgram.status as 'active' | 'inactive',
    };
  }

  async delete(programId: string): Promise<ProgramsDto> {
    const deletedProgram = await this.prismaService.program.delete({
      where: { id: programId },
    });
    return {
      ...deletedProgram,
      status: deletedProgram.status as 'active' | 'inactive',
    };
  }

  async findAll(
    page: number,
    limit: number,
    status: string,
  ): Promise<ProgramsDto[]> {
    const whereOptions = {
      status: status ? { equals: status as 'active' | 'inactive' } : undefined,
    };
    const programs = await this.prismaService.program.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: whereOptions,
    });
    return programs.map((program) => ({
      ...program,
      status: program.status as 'active' | 'inactive',
    }));
  }

  async findById(programId: string): Promise<ProgramsDto> {
    const program = await this.prismaService.program.findUnique({
      where: { id: programId },
    });

    if (!program) {
      throw new Error(`Program with ID ${programId} not found`);
    }

    return {
      ...program,
      status: program.status as 'active' | 'inactive',
    };
  }

  async findByName(programName: string): Promise<ProgramsDto> {
    const program = await this.prismaService.program.findFirstOrThrow({
      where: {
        title: {
          contains: programName,
          mode: 'insensitive',
        },
      },
    });

    return {
      ...program,
      status: program.status as 'active' | 'inactive',
    };
  }

  async update(
    programId: string,
    data: UpdateProgramDTO,
  ): Promise<ProgramsDto> {
    const updatedProgram = await this.prismaService.program.update({
      where: { id: programId },
      data,
    });

    return {
      ...updatedProgram,
      status: updatedProgram.status as 'active' | 'inactive',
    };
  }
}
