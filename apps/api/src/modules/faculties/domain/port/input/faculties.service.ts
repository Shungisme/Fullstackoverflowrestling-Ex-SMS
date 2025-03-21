import { Inject, Injectable } from '@nestjs/common';
import { CreateFacultyDTO } from '../../dto/create-faculty.dto';
import { UpdateFacultyDTO } from '../../dto/update-faculty.dto';
import {
  FACULTIES_REPOSITORY,
  IFacultiesRepository,
} from '../output/IFacultiesRepository';
import { IFacultiesService } from './IFaculitiesService';
import { PaginatedResponse } from 'src/shared/types/PaginatedResponse';
import { FacultiesDto } from '../../dto/faculties.dto';

@Injectable()
export class FacultiesService implements IFacultiesService {
  constructor(
    @Inject(FACULTIES_REPOSITORY)
    private facultiesRepository: IFacultiesRepository,
  ) {}

  async count(): Promise<number> {
    try {
      return await this.facultiesRepository.count();
    } catch (error) {
      throw new Error(`Error counting faculties: ${error.message}`);
    }
  }

  async create(faculty: CreateFacultyDTO) {
    try {
      return await this.facultiesRepository.create(faculty);
    } catch (error) {
      throw new Error(`Error creating faculty: ${error.message}`);
    }
  }

  async delete(facultyId: string) {
    try {
      return await this.facultiesRepository.delete(facultyId);
    } catch (error) {
      throw new Error(
        `Error deleting faculty with ID ${facultyId}: ${error.message}`,
      );
    }
  }

  async findAll(
    page: number,
    limit: number,
  ): Promise<PaginatedResponse<FacultiesDto>> {
    try {
      const faculties = await this.facultiesRepository.findAll(page, limit);
      const totalFaculties = await this.facultiesRepository.count();

      return {
        data: faculties,
        page,
        totalPage: Math.ceil(totalFaculties / limit),
        limit,
        total: totalFaculties,
      };
    } catch (error) {
      throw new Error(`Error finding all faculties: ${error.message}`);
    }
  }

  async findById(facultyId: string) {
    try {
      return await this.facultiesRepository.findById(facultyId);
    } catch (error) {
      throw new Error(
        `Error finding faculty with ID ${facultyId}: ${error.message}`,
      );
    }
  }

  async update(facultyId: string, data: UpdateFacultyDTO) {
    try {
      return await this.facultiesRepository.update(facultyId, data);
    } catch (error) {
      throw new Error(
        `Error updating faculty with ID ${facultyId}: ${error.message}`,
      );
    }
  }
}
