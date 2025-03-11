import {
  DeleteStudentResponseDTO,
  StudentRequestDTO,
  StudentResponseDTO,
  UpdateStudentRequestDTO,
} from '../../dto/student-dto';

export interface IStudentRepository {
  create(student: StudentRequestDTO): Promise<StudentResponseDTO>;
  delete(studentId: string): Promise<DeleteStudentResponseDTO>;
  update(student: UpdateStudentRequestDTO): Promise<StudentResponseDTO>;
  findById(studentId: string): Promise<StudentResponseDTO | null>;
  search(query: any): Promise<StudentResponseDTO[]>;
}

export const STUDENT_REPOSITORY = Symbol('IStudentRepository');
