import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IStudentService } from './IStudentService';
import {
  IStudentRepository,
  STUDENT_REPOSITORY,
} from '../output/IStudentRepository';
import { StudentRequestDTO } from '../../dto/student-dto';
import { SearchRequestDTO } from '../../dto/search-dto';
import { DeleteStudentResponseDTO } from '../../dto/delete-dto';
import {
  isIncompatibleNullValueError,
  isNotFoundPrismaError,
  isNotNullPrismaError,
  isUniqueConstraintPrismaError,
} from 'src/shared/helpers/error';
import {
  StudentResponseDTO,
  StudentsResponseDTO,
} from '../../dto/student-response-dto';

@Injectable()
export class StudentService implements IStudentService {
  constructor(
    @Inject(STUDENT_REPOSITORY)
    private readonly studentRepository: IStudentRepository,
  ) {}

  async search(query: SearchRequestDTO): Promise<StudentsResponseDTO> {
    try {
      const students = await this.studentRepository.search(query);
      const total = await this.studentRepository.count();
      return {
        students: students,
        total: total,
      };
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw new NotFoundException('No students found matching the criteria');
      }

      if (isNotNullPrismaError(error)) {
        throw new BadRequestException(
          `Missing required field:  ${error.message}`,
        );
      }

      if (isIncompatibleNullValueError(error)) {
        throw new BadRequestException(
          `Null value found for a required field:  ${error.message}`,
        );
      }
      throw error;
    }
  }

  async create(student: StudentRequestDTO): Promise<StudentResponseDTO> {
    try {
      return this.studentRepository.create(student);
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw new ConflictException(
          `Student with ID ${student.studentId} already exists: ${error.message}`,
        );
      }
      if (isNotNullPrismaError(error)) {
        throw new BadRequestException(
          `Missing required field:  ${error.message}`,
        );
      }

      if (isIncompatibleNullValueError(error)) {
        throw new BadRequestException(
          `Null value found for a required field:  ${error.message}`,
        );
      }

      throw error;
    }
  }

  async delete(studentId: string): Promise<DeleteStudentResponseDTO> {
    try {
      await this.studentRepository.delete(studentId);

      return {
        isDeleted: true,
        message: 'Delete successfully',
      };
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw new NotFoundException(
          `Student with ID ${studentId} not found: ${error.message}`,
        );
      }
      throw error;
    }
  }

  async update(student: StudentRequestDTO): Promise<StudentResponseDTO> {
    try {
      return await this.studentRepository.update(student);
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw new NotFoundException(
          `Student with ID ${student.studentId} not found: ${error.message}`,
        );
      }
      throw error;
    }
  }

  async findById(studentId: string): Promise<StudentResponseDTO> {
    const student = await this.studentRepository.findById(studentId);
    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found: `);
    }
    return student;
  }
}
