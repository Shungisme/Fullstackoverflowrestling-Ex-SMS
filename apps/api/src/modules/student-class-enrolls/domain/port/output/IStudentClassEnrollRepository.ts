import { CreateStudentClassEnrollDTO } from '../../dto/create-student-class-enroll.dto';
import { StudentClassEnrollDto } from '../../dto/student-class-enroll.dto';
import { UpdateStudentClassEnrollDTO } from '../../dto/update-student-class-enroll.dto';

export interface IStudentClassEnrollRepository {
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
  ): Promise<StudentClassEnrollDto[]>;

  findByClass(
    classCode: string,
    page: number,
    limit: number,
  ): Promise<StudentClassEnrollDto[]>;

  findAll(page: number, limit: number): Promise<StudentClassEnrollDto[]>;

  count(whereOptions: any): Promise<number>;
}

export const STUDENT_CLASS_ENROLL_REPOSITORY = Symbol(
  'IStudentClassEnrollRepository',
);
