import { CreateStudentWithAddressDTO } from '../../dto/create-student-dto';
import { DeleteStudentResponseDTO } from '../../dto/delete-dto';
import { SearchRequestDTO } from '../../dto/search-dto';
import { UpdateStudentRequestDTO } from '../../dto/student-dto';
import {
  StudentResponseDTO,
  StudentsResponseDTO,
} from '../../dto/student-response-dto';
import { Response } from 'express';

export interface IStudentService {
  create(student: CreateStudentWithAddressDTO): Promise<StudentResponseDTO>;
  delete(studentId: string): Promise<DeleteStudentResponseDTO>;
  update(student: UpdateStudentRequestDTO): Promise<StudentResponseDTO>;
  findById(studentId: string, lang?: string): Promise<StudentResponseDTO>;
  search(query: SearchRequestDTO): Promise<StudentsResponseDTO>;
  upload(
    file: Express.Multer.File,
  ): Promise<{ isCreated: boolean; message: string }>;
  exportFile(type: string, res: Response): Promise<any>;
  exportTranscript(studentId: string, res: Response): Promise<void>;
}
