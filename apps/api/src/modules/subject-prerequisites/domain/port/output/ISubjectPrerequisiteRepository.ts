import { CreateSubjectPrerequisiteDTO } from '../../dto/create-subject-prerequisite.dto';
import { SubjectPrerequisiteResponseDto } from '../../dto/subject-prerequisite.dto';
import { UpdateSubjectPrerequisiteDTO } from '../../dto/update-subject-prerequisite.dto';

export interface ISubjectPrerequisiteRepository {
  create(
    prerequisite: CreateSubjectPrerequisiteDTO,
  ): Promise<SubjectPrerequisiteResponseDto>;

  update(
    prerequisiteId: string,
    data: UpdateSubjectPrerequisiteDTO,
  ): Promise<SubjectPrerequisiteResponseDto>;

  delete(prerequisiteId: string): Promise<SubjectPrerequisiteResponseDto>;

  findById(prerequisiteId: string): Promise<SubjectPrerequisiteResponseDto>;

  findBySubjectId(subjectId: string): Promise<SubjectPrerequisiteResponseDto[]>;

  findByPrerequisiteSubjectId(
    prerequisiteSubjectId: string,
  ): Promise<SubjectPrerequisiteResponseDto[]>;

  findByClassCode(classCode: string): Promise<SubjectPrerequisiteResponseDto[]>;

  findAll(
    page: number,
    limit: number,
  ): Promise<SubjectPrerequisiteResponseDto[]>;

  count(whereOptions: any): Promise<number>;

  // Check if a prerequisite relationship already exists
  exists(subjectId: string, prerequisiteSubjectId: string): Promise<boolean>;
}

export const SUBJECT_PREREQUISITE_REPOSITORY = Symbol(
  'ISubjectPrerequisiteRepository',
);
