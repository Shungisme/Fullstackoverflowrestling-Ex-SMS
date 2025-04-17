import { Inject, Injectable } from '@nestjs/common';
import { CreateStudentClassResultDTO } from '../../dto/create-student-class-result.dto';
import { UpdateStudentClassResultDTO } from '../../dto/update-student-class-result.dto';
import {
  STUDENT_CLASS_RESULT_REPOSITORY,
  IStudentClassResultRepository,
} from '../output/IStudentClassResultRepository';
import { IStudentClassResultService } from './IStudentClassResultService';
import { PaginatedResponse } from 'src/shared/types/PaginatedResponse';
import { StudentClassResultDto } from '../../dto/student-class-result.dto';

@Injectable()
export class StudentClassResultService implements IStudentClassResultService {
  constructor(
    @Inject(STUDENT_CLASS_RESULT_REPOSITORY)
    private studentClassResultRepository: IStudentClassResultRepository,
  ) {}

  async count(whereOptions: any): Promise<number> {
    try {
      return await this.studentClassResultRepository.count(whereOptions);
    } catch (error) {
      throw new Error(`Error counting student class results: ${error.message}`);
    }
  }

  async create(result: CreateStudentClassResultDTO) {
    try {
      return await this.studentClassResultRepository.create(result);
    } catch (error) {
      throw new Error(`Error creating student class result: ${error.message}`);
    }
  }

  async delete(resultId: string) {
    try {
      return await this.studentClassResultRepository.delete(resultId);
    } catch (error) {
      throw new Error(
        `Error deleting student class result with ID ${resultId}: ${error.message}`,
      );
    }
  }

  async findAll(
    page: number,
    limit: number,
  ): Promise<PaginatedResponse<StudentClassResultDto>> {
    try {
      const results = await this.studentClassResultRepository.findAll(
        page,
        limit,
      );
      const totalResults = await this.count({});

      return {
        data: results,
        page,
        totalPage: Math.ceil(totalResults / limit),
        limit,
        total: totalResults,
      };
    } catch (error) {
      throw new Error(
        `Error finding all student class results: ${error.message}`,
      );
    }
  }

  async findById(resultId: string) {
    try {
      return await this.studentClassResultRepository.findById(resultId);
    } catch (error) {
      throw new Error(
        `Error finding student class result with ID ${resultId}: ${error.message}`,
      );
    }
  }

  async findByStudentAndClass(studentId: string, classCode: string) {
    try {
      return await this.studentClassResultRepository.findByStudentAndClass(
        studentId,
        classCode,
      );
    } catch (error) {
      throw new Error(
        `Error finding results for student ${studentId} and class ${classCode}: ${error.message}`,
      );
    }
  }

  async findByStudent(
    studentId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResponse<StudentClassResultDto>> {
    try {
      const results = await this.studentClassResultRepository.findByStudent(
        studentId,
        page,
        limit,
      );
      const totalResults = await this.count({ studentId });

      return {
        data: results,
        page,
        totalPage: Math.ceil(totalResults / limit),
        limit,
        total: totalResults,
      };
    } catch (error) {
      throw new Error(
        `Error finding results for student ${studentId}: ${error.message}`,
      );
    }
  }

  async findByClass(
    classCode: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResponse<StudentClassResultDto>> {
    try {
      const results = await this.studentClassResultRepository.findByClass(
        classCode,
        page,
        limit,
      );
      const totalResults = await this.count({ classCode });

      return {
        data: results,
        page,
        totalPage: Math.ceil(totalResults / limit),
        limit,
        total: totalResults,
      };
    } catch (error) {
      throw new Error(
        `Error finding results for class ${classCode}: ${error.message}`,
      );
    }
  }

  async update(resultId: string, data: UpdateStudentClassResultDTO) {
    try {
      return await this.studentClassResultRepository.update(resultId, data);
    } catch (error) {
      throw new Error(
        `Error updating student class result with ID ${resultId}: ${error.message}`,
      );
    }
  }
}
