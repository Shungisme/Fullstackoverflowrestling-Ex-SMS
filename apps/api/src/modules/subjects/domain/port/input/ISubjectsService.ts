import { PaginatedResponse } from 'src/shared/types/PaginatedResponse';
import { CreateSubjectDTO } from '../../dto/create-subject.dto';
import { SubjectsDto } from '../../dto/subjects.dto';
import { UpdateSubjectDTO } from '../../dto/update-subject.dto';

export interface ISubjectsService {
  create(subject: CreateSubjectDTO): Promise<SubjectsDto>;

  update(subjectId: string, data: UpdateSubjectDTO): Promise<SubjectsDto>;

  delete(subjectId: string): Promise<SubjectsDto>;

  findById(subjectId: string): Promise<SubjectsDto>;

  findByCode(subjectCode: string): Promise<SubjectsDto>;

  findAll(
    page: number,
    limit: number,
    status: string,
    facultyId?: string,
  ): Promise<PaginatedResponse<SubjectsDto>>;

  count(whereOptions: any): Promise<number>;
}
