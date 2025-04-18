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
import { IStudentClassEnrollRepository } from 'src/modules/student-class-enrolls/domain/port/output/IStudentClassEnrollRepository';
import { IClassesRepository } from 'src/modules/classes/domain/port/output/IClassesRepository';

@Injectable()
export class SubjectsService implements ISubjectsService {
  constructor(
    @Inject(SUBJECTS_REPOSITORY)
    private subjectsRepository: ISubjectsRepository,
    private studentClassEnrollRepository: IStudentClassEnrollRepository,
    private classesRepository: IClassesRepository,
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
      const subject = await this.subjectsRepository.findById(subjectId);

      const current = new Date();
      const thirtyMinutesAgo = new Date(current.getTime() - 30 * 60 * 1000);
      if (subject.createdAt && subject.createdAt <= thirtyMinutesAgo) {
        throw new Error(
          `Cannot delete subject with ID ${subjectId} because it was created more than 30 minutes ago`,
        );
      } else {
        const classes = await this.classesRepository.findBySubjectCode(
          subject.code,
        );

        if (classes.length > 0) {
          return this.subjectsRepository.update(subjectId, {
            status: 'DEACTIVATED',
          });
        }

        return await this.subjectsRepository.delete(subjectId);
      }
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
      const subject = await this.subjectsRepository.findById(subjectId);
      const studentClassEnrolls =
        await this.studentClassEnrollRepository.findBySubjectCode(subject.code);

      if (subject.credit !== data.credit && studentClassEnrolls.length > 0) {
        throw new Error(
          `Cannot update credit of subject with ID ${subjectId} because it has student class enrollments`,
        );
      }

      return await this.subjectsRepository.update(subjectId, data);
    } catch (error) {
      throw new Error(
        `Error updating subject with ID ${subjectId}: ${error.message}`,
      );
    }
  }
}
