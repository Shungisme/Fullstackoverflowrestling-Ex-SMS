import { PaginatedResponse } from 'src/shared/types/PaginatedResponse';
import { CreateStudentClassEnrollDTO } from '../../dto/create-student-class-enroll.dto';
import { StudentClassEnrollDto } from '../../dto/student-class-enroll.dto';
import { UpdateStudentClassEnrollDTO } from '../../dto/update-student-class-enroll.dto';

export interface IStudentClassEnrollService {
  create(enroll: CreateStudentClassEnrollDTO): Promise<StudentClassEnrollDto>;

  update(
    enrollId: string,
    data: UpdateStudentClassEnrollDTO,
  ): Promise<StudentClassEnrollDto>;

  delete(enrollId: string): Promise<StudentClassEnrollDto>;

  findById(enrollId: string): Promise<StudentClassEnrollDto>;

  findByStudentAndClass(
    studentId: string,
    classCode: string,
  ): Promise<StudentClassEnrollDto>;

  findByStudent(
    studentId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResponse<StudentClassEnrollDto>>;

  findByClass(
    classCode: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResponse<StudentClassEnrollDto>>;

  findAll(
    page: number,
    limit: number,
  ): Promise<PaginatedResponse<StudentClassEnrollDto>>;

  count(whereOptions: any): Promise<number>;
}
