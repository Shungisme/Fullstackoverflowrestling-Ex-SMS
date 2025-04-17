import {
  Student,
  StudentResponse,
} from 'src/modules/students/adapters/driven/types/student-type';
import { SearchStudent } from 'src/modules/students/adapters/driven/types/search-type';
import { CreateStudentWithAddressDTO } from '../../dto/create-student-dto';
import { UpdateStudentRequestDTO } from '../../dto/student-dto';

export interface IStudentRepository {
  create(student: CreateStudentWithAddressDTO): Promise<StudentResponse>;
  createMany(students: Student[]): Promise<number>;
  delete(studentId: string): Promise<StudentResponse>;
  update(student: UpdateStudentRequestDTO): Promise<StudentResponse>;
  updateStudentField(
    studentId: string,
    field: keyof Student,
    value: any,
  ): Promise<StudentResponse | null>;
  findById(studentId: string): Promise<StudentResponse | null>;
  search(query: SearchStudent): Promise<StudentResponse[]>;
  count(): Promise<number>;
  getAll(): Promise<StudentResponse[] | null>;
  getStudentResults(studentId: string): Promise<any[]>;
}

export const STUDENT_REPOSITORY = Symbol('IStudentRepository');
