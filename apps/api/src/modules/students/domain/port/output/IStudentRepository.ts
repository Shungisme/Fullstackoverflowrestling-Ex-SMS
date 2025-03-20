import { Student } from 'src/modules/students/adapters/driven/types/student-type';
import { SearchStudent } from 'src/modules/students/adapters/driven/types/search-type';

export interface IStudentRepository {
  create(student: Student): Promise<Student>;
  delete(studentId: string): Promise<Student>;
  update(student: Student): Promise<Student>;
  findById(studentId: string): Promise<Student | null>;
  search(query: SearchStudent): Promise<Student[]>;
  count(): Promise<number>;
}

export const STUDENT_REPOSITORY = Symbol('IStudentRepository');
