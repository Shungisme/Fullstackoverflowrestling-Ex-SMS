import { DeleteStudentResponseDTO } from '../../dto/delete-dto';
import { SearchRequestDTO } from '../../dto/search-dto';
import {
  StudentRequestDTO,
  UpdateStudentRequestDTO,
} from '../../dto/student-dto';
import {
  StudentResponseDTO,
  StudentsResponseDTO,
} from '../../dto/student-response-dto';
import { Response } from 'express';

export interface IStudentService {
  create(student: StudentRequestDTO): Promise<StudentResponseDTO>;
  delete(studentId: string): Promise<DeleteStudentResponseDTO>;
  update(student: UpdateStudentRequestDTO): Promise<StudentResponseDTO>;
  findById(studentId: string): Promise<StudentResponseDTO>;
  search(query: SearchRequestDTO): Promise<StudentsResponseDTO>;
  upload(
    file: Express.Multer.File,
  ): Promise<{ isCreated: boolean; message: string }>;
  exportFile(type: string, res: Response): Promise<any>;
}
