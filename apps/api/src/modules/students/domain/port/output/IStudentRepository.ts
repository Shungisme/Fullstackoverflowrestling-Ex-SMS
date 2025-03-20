import {
  Student,
  StudentResponse,
} from 'src/modules/students/adapters/driven/types/student-type';
import { SearchStudent } from 'src/modules/students/adapters/driven/types/search-type';

export interface IStudentRepository {
  create(student: Student): Promise<StudentResponse>;
  delete(studentId: string): Promise<StudentResponse>;
  update(student: Student): Promise<StudentResponse>;
  findById(studentId: string): Promise<StudentResponse | null>;
  search(query: SearchStudent): Promise<StudentResponse[]>;
  count(): Promise<number>;
}

export const STUDENT_REPOSITORY = Symbol('IStudentRepository');
