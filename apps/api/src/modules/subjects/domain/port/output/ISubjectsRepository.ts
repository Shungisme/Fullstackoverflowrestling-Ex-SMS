import { CreateSubjectDTO } from '../../dto/create-subject.dto';
import { SubjectsDto } from '../../dto/subjects.dto';
import { UpdateSubjectDTO } from '../../dto/update-subject.dto';

export interface ISubjectsRepository {
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
  ): Promise<SubjectsDto[]>;

  count(whereOptions: any): Promise<number>;
}

export const SUBJECTS_REPOSITORY = Symbol('ISubjectsRepository');
