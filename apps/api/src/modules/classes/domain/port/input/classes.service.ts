import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateClassDTO } from '../../dto/create-class.dto';
import { UpdateClassDTO } from '../../dto/update-class.dto';
import {
  CLASSES_REPOSITORY,
  IClassesRepository,
} from '../output/IClassesRepository';
import { IClassesService } from './IClassesService';
import { PaginatedResponse } from 'src/shared/types/PaginatedResponse';
import { ClassResponseDto } from '../../dto/classes.dto';
import {
  ISubjectsRepository,
  SUBJECTS_REPOSITORY,
} from 'src/modules/subjects/domain/port/output/ISubjectsRepository';

@Injectable()
export class ClassesService implements IClassesService {
  constructor(
    @Inject(CLASSES_REPOSITORY)
    private classesRepository: IClassesRepository,

    @Inject(SUBJECTS_REPOSITORY)
    private subjectsRepository: ISubjectsRepository,
  ) {}

  async count(whereOptions: any): Promise<number> {
    try {
      return await this.classesRepository.count(whereOptions);
    } catch (error) {
      throw new Error(`Error counting classes: ${error.message}`);
    }
  }

  async create(classData: CreateClassDTO): Promise<ClassResponseDto> {
    try {
      // Check if class with same code already exists
      try {
        const existingClass = await this.classesRepository.findByCode(
          classData.code,
        );
        if (existingClass) {
          throw new ConflictException(
            `Class with code ${classData.code} already exists`,
          );
        }
        const existingSubject = await this.subjectsRepository.findByCode(
          classData.subjectCode,
        );
        if (!existingSubject) {
          throw new NotFoundException(
            `Subject with code ${classData.subjectCode} not found`,
          );
        }
        if (existingSubject.status == 'DEACTIVATED') {
          throw new ConflictException(
            `Cannot create class for deactivated subject ${classData.subjectCode}`,
          );
        }
      } catch (error) {
        // If error is not a NotFoundException, rethrow
        if (!(error instanceof NotFoundException)) {
          throw error;
        }
        // Otherwise, proceed with creation
      }

      return await this.classesRepository.create(classData);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new Error(`Error creating class: ${error.message}`);
    }
  }

  async delete(classId: string): Promise<ClassResponseDto> {
    try {
      return await this.classesRepository.delete(classId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(
        `Error deleting class with ID ${classId}: ${error.message}`,
      );
    }
  }

  async findAll(
    page: number,
    limit: number,
    filters?: {
      subjectCode?: string;
      semesterId?: string;
      academicYear?: string;
      semester?: number;
    },
  ): Promise<PaginatedResponse<ClassResponseDto>> {
    try {
      const classes = await this.classesRepository.findAll(
        page,
        limit,
        filters,
      );

      const whereOptions: any = {};
      if (filters?.subjectCode) {
        whereOptions.subjectCode = filters.subjectCode;
      }
      if (filters?.semesterId) {
        whereOptions.semesterId = filters.semesterId;
      }

      const total = await this.count(whereOptions);

      return {
        data: classes,
        page,
        totalPage: Math.ceil(total / limit),
        limit,
        total,
      };
    } catch (error) {
      throw new Error(`Error finding all classes: ${error.message}`);
    }
  }

  async findById(classId: string): Promise<ClassResponseDto> {
    try {
      const classData = await this.classesRepository.findById(classId);
      if (!classData) {
        throw new NotFoundException(`Class with ID ${classId} not found`);
      }

      // Get current enrollment count
      const currentEnrollments =
        await this.classesRepository.getCurrentEnrollmentCount(classData.code);
      return {
        ...classData,
        currentEnrollments,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(
        `Error finding class with ID ${classId}: ${error.message}`,
      );
    }
  }

  async findByCode(classCode: string): Promise<ClassResponseDto> {
    try {
      const classData = await this.classesRepository.findByCode(classCode);
      if (!classData) {
        throw new NotFoundException(`Class with code ${classCode} not found`);
      }

      // Get current enrollment count
      const currentEnrollments =
        await this.classesRepository.getCurrentEnrollmentCount(classCode);
      return {
        ...classData,
        currentEnrollments,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(
        `Error finding class with code ${classCode}: ${error.message}`,
      );
    }
  }

  async findBySubject(
    subjectCode: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResponse<ClassResponseDto>> {
    try {
      const filters = { subjectCode };
      return this.findAll(page, limit, filters);
    } catch (error) {
      throw new Error(
        `Error finding classes for subject ${subjectCode}: ${error.message}`,
      );
    }
  }

  async findBySemester(
    semesterId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResponse<ClassResponseDto>> {
    try {
      const filters = { semesterId };
      return this.findAll(page, limit, filters);
    } catch (error) {
      throw new Error(
        `Error finding classes for semester ${semesterId}: ${error.message}`,
      );
    }
  }

  async findByAcademicYear(
    academicYear: string,
    semester: number,
    page: number,
    limit: number,
  ): Promise<PaginatedResponse<ClassResponseDto>> {
    try {
      if (!academicYear || !semester) {
        throw new BadRequestException(
          'Academic year and semester are required',
        );
      }

      const filters = { academicYear, semester };
      return this.findAll(page, limit, filters);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new Error(
        `Error finding classes for academic year ${academicYear}, semester ${semester}: ${error.message}`,
      );
    }
  }

  async update(
    classId: string,
    data: UpdateClassDTO,
  ): Promise<ClassResponseDto> {
    try {
      // Check if class exists
      await this.findById(classId);

      return await this.classesRepository.update(classId, data);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(
        `Error updating class with ID ${classId}: ${error.message}`,
      );
    }
  }
}
