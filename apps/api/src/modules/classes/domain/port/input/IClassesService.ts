import { PaginatedResponse } from 'src/shared/types/PaginatedResponse';
import { CreateClassDTO } from '../../dto/create-class.dto';
import { ClassResponseDto } from '../../dto/classes.dto';
import { UpdateClassDTO } from '../../dto/update-class.dto';

export interface IClassesService {
  create(classData: CreateClassDTO): Promise<ClassResponseDto>;

  update(classId: string, data: UpdateClassDTO): Promise<ClassResponseDto>;

  delete(classId: string): Promise<ClassResponseDto>;

  findById(classId: string): Promise<ClassResponseDto>;

  findByCode(classCode: string): Promise<ClassResponseDto>;

  findAll(
    page: number,
    limit: number,
    filters?: {
      subjectCode?: string;
      semesterId?: string;
      academicYear?: string;
      semester?: number;
    },
  ): Promise<PaginatedResponse<ClassResponseDto>>;

  count(whereOptions: any): Promise<number>;

  findBySubject(
    subjectCode: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResponse<ClassResponseDto>>;

  findBySemester(
    semesterId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResponse<ClassResponseDto>>;

  findByAcademicYear(
    academicYear: string,
    semester: number,
    page: number,
    limit: number,
  ): Promise<PaginatedResponse<ClassResponseDto>>;
}
