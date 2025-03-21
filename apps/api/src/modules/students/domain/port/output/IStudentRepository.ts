import {
  Student,
  StudentResponse,
} from 'src/modules/students/adapters/driven/types/student-type';
import { SearchStudent } from 'src/modules/students/adapters/driven/types/search-type';

export interface IStudentRepository {
  create(student: Student): Promise<StudentResponse>;
  createMany(students: Student[]): Promise<number>;
  delete(studentId: string): Promise<StudentResponse>;
  update(student: Student): Promise<StudentResponse>;
  updateStudentField(
    studentId: string,
    field: keyof Student,
    value: any,
  ): Promise<StudentResponse | null>;
  findById(studentId: string): Promise<StudentResponse | null>;
  search(query: SearchStudent): Promise<StudentResponse[]>;
  count(): Promise<number>;
  getAll(): Promise<StudentResponse[] | null>;
}

export const STUDENT_REPOSITORY = Symbol('IStudentRepository');
