import { DeleteStudentResponseDTO } from '../../dto/delete-dto';
import { SearchRequestDTO } from '../../dto/search-dto';
import {
  StudentRequestDTO,
  StudentResponseDTO,
  UpdateStudentRequestDTO,
} from '../../dto/student-dto';

export interface IStudentService {
  create(student: StudentRequestDTO): Promise<StudentResponseDTO>;
  delete(studentId: string): Promise<DeleteStudentResponseDTO>;
  update(student: UpdateStudentRequestDTO): Promise<StudentResponseDTO>;
  findById(studentId: string): Promise<StudentResponseDTO>;
  search(query: SearchRequestDTO): Promise<StudentResponseDTO[]>;
}
