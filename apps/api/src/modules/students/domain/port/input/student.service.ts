import {
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
  DeleteStudentResponseDTO,
  StudentRequestDTO,
  StudentResponseDTO,
} from '../../dto/student-dto';

@Injectable()
export class StudentService implements IStudentService {
  constructor(
    @Inject(STUDENT_REPOSITORY)
    private readonly studentRepository: IStudentRepository,
  ) {}

  async search(query: any): Promise<StudentResponseDTO[]> {
    const students = await this.studentRepository.search(query);
    if (!students || students.length === 0) {
      throw new NotFoundException('No students found matching the criteria');
    }
    return students;
  }

  async create(student: StudentRequestDTO): Promise<StudentResponseDTO> {
    const existingStudent = await this.studentRepository.findById(
      student.studentId as string,
    );
    if (existingStudent) {
      throw new ConflictException(
        `Student with ID ${student.studentId} already exists`,
      );
    }
    return this.studentRepository.create(student);
  }

  async delete(studentId: string): Promise<DeleteStudentResponseDTO> {
    const student = await this.studentRepository.findById(studentId);
    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }
    const result = await this.studentRepository.delete(studentId);
    if (!result) {
      throw new NotFoundException(
        `Failed to delete student with ID ${studentId}`,
      );
    }
    return result;
  }

  async update(student: StudentRequestDTO): Promise<StudentResponseDTO> {
    const existingStudent = await this.studentRepository.findById(
      student.studentId as string,
    );
    if (!existingStudent) {
      throw new NotFoundException(
        `Student with ID ${student.studentId} not found`,
      );
    }
    return this.studentRepository.update(student);
  }

  async findById(studentId: string): Promise<StudentResponseDTO> {
    const student = await this.studentRepository.findById(studentId);
    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }
    return student;
  }
}
