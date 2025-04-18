import { CreateClassDTO } from '../../dto/create-class.dto';
import { ClassResponseDto } from '../../dto/classes.dto';
import { UpdateClassDTO } from '../../dto/update-class.dto';

export interface IClassesRepository {
  create(classData: CreateClassDTO): Promise<ClassResponseDto>;

  update(classId: string, data: UpdateClassDTO): Promise<ClassResponseDto>;

  delete(classId: string): Promise<ClassResponseDto>;

  findById(classId: string): Promise<ClassResponseDto>;

  findByCode(classCode: string): Promise<ClassResponseDto>;

  findBySubjectCode(subjectCode: string): Promise<ClassResponseDto[]>;

  findAll(
    page: number,
    limit: number,
    filters?: {
      subjectCode?: string;
      semesterId?: string;
      academicYear?: string;
      semester?: number;
    },
  ): Promise<ClassResponseDto[]>;

  count(whereOptions: any): Promise<number>;

  getCurrentEnrollmentCount(classCode: string): Promise<number>;
}

export const CLASSES_REPOSITORY = Symbol('IClassesRepository');
