import { SearchRequestDTO } from '../../dto/search-dto';
import {
  StudentRequestDTO,
  StudentResponseDTO,
  UpdateStudentRequestDTO,
} from '../../dto/student-dto';

export interface IStudentRepository {
  create(student: StudentRequestDTO): Promise<StudentResponseDTO>;
  delete(studentId: string): Promise<StudentResponseDTO>;
  update(student: UpdateStudentRequestDTO): Promise<StudentResponseDTO>;
  findById(studentId: string): Promise<StudentResponseDTO | null>;
  search(query: SearchRequestDTO): Promise<StudentResponseDTO[]>;
  count(): Promise<number>;
}

export const STUDENT_REPOSITORY = Symbol('IStudentRepository');
