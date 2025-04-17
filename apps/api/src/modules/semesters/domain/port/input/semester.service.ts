import { Inject, Injectable } from '@nestjs/common';
import { CreateSemesterDTO } from '../../dto/create-semester.dto';
import { UpdateSemesterDTO } from '../../dto/update-semester.dto';
import {
  SEMESTER_REPOSITORY,
  ISemesterRepository,
} from '../output/ISemesterRepository';
import { ISemesterService } from './ISemesterService';
import { PaginatedResponse } from 'src/shared/types/PaginatedResponse';
import { SemesterDto } from '../../dto/semester.dto';

@Injectable()
export class SemesterService implements ISemesterService {
  constructor(
    @Inject(SEMESTER_REPOSITORY)
    private semesterRepository: ISemesterRepository,
  ) {}

  async count(whereOptions: any): Promise<number> {
    try {
      return await this.semesterRepository.count(whereOptions);
    } catch (error) {
      throw new Error(`Error counting semesters: ${error.message}`);
    }
  }

  async create(semester: CreateSemesterDTO) {
    try {
      return await this.semesterRepository.create(semester);
    } catch (error) {
      throw new Error(`Error creating semester: ${error.message}`);
    }
  }

  async delete(semesterId: string) {
    try {
      return await this.semesterRepository.delete(semesterId);
    } catch (error) {
      throw new Error(
        `Error deleting semester with ID ${semesterId}: ${error.message}`,
      );
    }
  }

  async findAll(
    page: number,
    limit: number,
  ): Promise<PaginatedResponse<SemesterDto>> {
    try {
      const semesters = await this.semesterRepository.findAll(page, limit);
      const totalSemesters = await this.count({});

      return {
        data: semesters,
        page,
        totalPage: Math.ceil(totalSemesters / limit),
        limit,
        total: totalSemesters,
      };
    } catch (error) {
      throw new Error(`Error finding all semesters: ${error.message}`);
    }
  }

  async findById(semesterId: string) {
    try {
      return await this.semesterRepository.findById(semesterId);
    } catch (error) {
      throw new Error(
        `Error finding semester with ID ${semesterId}: ${error.message}`,
      );
    }
  }

  async update(semesterId: string, data: UpdateSemesterDTO) {
    try {
      return await this.semesterRepository.update(semesterId, data);
    } catch (error) {
      throw new Error(
        `Error updating semester with ID ${semesterId}: ${error.message}`,
      );
    }
  }
}
