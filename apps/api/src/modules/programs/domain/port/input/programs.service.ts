import { Inject, Injectable } from '@nestjs/common';
import { CreateProgramDTO } from '../../dto/create-program.dto';
import { UpdateProgramDTO } from '../../dto/update-program.dto';
import {
  IProgramsRepository,
  PROGRAM_REPOSITORY,
} from '../output/IProgramsRepository';
import { IProgramsService } from './IProgramsService';
import { PaginatedResponse } from 'src/shared/types/PaginatedResponse';
import { ProgramsDto } from '../../dto/programs.dto';

@Injectable()
export class ProgramsService implements IProgramsService {
  constructor(
    @Inject(PROGRAM_REPOSITORY)
    private programsRepository: IProgramsRepository,
  ) {}

  async count(): Promise<number> {
    try {
      return await this.programsRepository.count();
    } catch (error) {
      throw new Error(`Error counting programs: ${error.message}`);
    }
  }

  async create(program: CreateProgramDTO) {
    try {
      return await this.programsRepository.create(program);
    } catch (error) {
      throw new Error(`Error creating program: ${error.message}`);
    }
  }

  async delete(programId: string) {
    try {
      return await this.programsRepository.delete(programId);
    } catch (error) {
      throw new Error(
        `Error deleting program with ID ${programId}: ${error.message}`,
      );
    }
  }

  async findAll(
    page: number,
    limit: number,
  ): Promise<PaginatedResponse<ProgramsDto>> {
    try {
      const programs = await this.programsRepository.findAll(page, limit);
      const totalPrograms = await this.programsRepository.count();

      return {
        data: programs,
        page,
        totalPage: Math.ceil(totalPrograms / limit),
        limit,
        total: totalPrograms,
      };
    } catch (error) {
      throw new Error(`Error finding all programs: ${error.message}`);
    }
  }

  async findById(programId: string) {
    try {
      return await this.programsRepository.findById(programId);
    } catch (error) {
      throw new Error(
        `Error finding program with ID ${programId}: ${error.message}`,
      );
    }
  }

  async update(programId: string, data: UpdateProgramDTO) {
    try {
      return await this.programsRepository.update(programId, data);
    } catch (error) {
      throw new Error(
        `Error updating program with ID ${programId}: ${error.message}`,
      );
    }
  }
}
