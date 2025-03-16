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
import {
  StudentRequestDTO,
  StudentResponseDTO,
  StudentsResponseDTO,
} from '../../dto/student-dto';
import { SearchRequestDTO } from '../../dto/search-dto';
import { DeleteStudentResponseDTO } from '../../dto/delete-dto';
import {
  isNotFoundPrismaError,
  isNotNullPrismaError,
  isUniqueConstraintPrismaError,
} from 'src/shared/helpers/error';

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
      throw error;
    }
  }

  async create(student: StudentRequestDTO): Promise<StudentResponseDTO> {
    try {
      const existedStudent = await this.studentRepository.findById(
        student.studentId as string,
      );
      if (existedStudent) {
        throw new ConflictException(
          `Student with ID ${student.studentId} already exists`,
        );
      }
      return this.studentRepository.create(student);
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw new ConflictException(
          `Student with ID ${student.studentId} already exists`,
        );
      }
      if (isNotNullPrismaError(error)) {
        throw new BadRequestException(`Missing required field`);
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
        throw new NotFoundException(`Student with ID ${studentId} not found`);
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
          `Student with ID ${student.studentId} not found`,
        );
      }
      throw error;
    }
  }

  async findById(studentId: string): Promise<StudentResponseDTO> {
    const student = await this.studentRepository.findById(studentId);
    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }
    return student;
  }
}
