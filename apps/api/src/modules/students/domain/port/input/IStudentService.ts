import {
  DeleteStudentResponseDTO,
  StudentRequestDTO,
  StudentResponseDTO,
  UpdateStudentRequestDTO,
} from '../../dto/student-dto';

export interface IStudentService {
  create(student: StudentRequestDTO): Promise<StudentResponseDTO>;
  delete(studentId: string): Promise<DeleteStudentResponseDTO>;
  update(student: UpdateStudentRequestDTO): Promise<StudentResponseDTO>;
  findById(studentId: string): Promise<StudentResponseDTO>;
  search(query: any): Promise<StudentResponseDTO[]>;
}
