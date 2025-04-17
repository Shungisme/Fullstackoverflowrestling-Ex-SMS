import { Inject, Injectable } from '@nestjs/common';
import { CreateSubjectDTO } from '../../dto/create-subject.dto';
import { UpdateSubjectDTO } from '../../dto/update-subject.dto';
import {
  SUBJECTS_REPOSITORY,
  ISubjectsRepository,
} from '../output/ISubjectsRepository';
import { ISubjectsService } from './ISubjectsService';
import { PaginatedResponse } from 'src/shared/types/PaginatedResponse';
import { SubjectsDto } from '../../dto/subjects.dto';

@Injectable()
export class SubjectsService implements ISubjectsService {
  constructor(
    @Inject(SUBJECTS_REPOSITORY)
    private subjectsRepository: ISubjectsRepository,
  ) {}

  async count(whereOptions: any): Promise<number> {
    try {
      return await this.subjectsRepository.count(whereOptions);
    } catch (error) {
      throw new Error(`Error counting subjects: ${error.message}`);
    }
  }

  async create(subject: CreateSubjectDTO) {
    try {
      return await this.subjectsRepository.create(subject);
    } catch (error) {
      throw new Error(`Error creating subject: ${error.message}`);
    }
  }

  async delete(subjectId: string) {
    try {
      return await this.subjectsRepository.delete(subjectId);
    } catch (error) {
      throw new Error(
        `Error deleting subject with ID ${subjectId}: ${error.message}`,
      );
    }
  }

  async findAll(
    page: number,
    limit: number,
    status: string,
    facultyId?: string,
  ): Promise<PaginatedResponse<SubjectsDto>> {
    try {
      const subjects = await this.subjectsRepository.findAll(
        page,
        limit,
        status,
        facultyId,
      );

      const totalCount = await this.count({
        status: status || undefined,
        facultyId: facultyId || undefined,
      });

      return {
        data: subjects,
        page,
        totalPage: Math.ceil(totalCount / limit),
        limit,
        total: totalCount,
      };
    } catch (error) {
      throw new Error(`Error finding all subjects: ${error.message}`);
    }
  }

  async findById(subjectId: string) {
    try {
      return await this.subjectsRepository.findById(subjectId);
    } catch (error) {
      throw new Error(
        `Error finding subject with ID ${subjectId}: ${error.message}`,
      );
    }
  }

  async findByCode(subjectCode: string) {
    try {
      return await this.subjectsRepository.findByCode(subjectCode);
    } catch (error) {
      throw new Error(
        `Error finding subject with code ${subjectCode}: ${error.message}`,
      );
    }
  }

  async update(subjectId: string, data: UpdateSubjectDTO) {
    try {
      return await this.subjectsRepository.update(subjectId, data);
    } catch (error) {
      throw new Error(
        `Error updating subject with ID ${subjectId}: ${error.message}`,
      );
    }
  }
}
