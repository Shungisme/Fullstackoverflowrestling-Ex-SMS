import { PaginatedResponse } from 'src/shared/types/PaginatedResponse';
import { CreateSubjectPrerequisiteDTO } from '../../dto/create-subject-prerequisite.dto';
import { SubjectPrerequisiteResponseDto } from '../../dto/subject-prerequisite.dto';
import { UpdateSubjectPrerequisiteDTO } from '../../dto/update-subject-prerequisite.dto';

export interface ISubjectPrerequisiteService {
  create(
    prerequisite: CreateSubjectPrerequisiteDTO,
  ): Promise<SubjectPrerequisiteResponseDto>;

  update(
    prerequisiteId: string,
    data: UpdateSubjectPrerequisiteDTO,
  ): Promise<SubjectPrerequisiteResponseDto>;

  delete(prerequisiteId: string): Promise<SubjectPrerequisiteResponseDto>;

  findById(prerequisiteId: string): Promise<SubjectPrerequisiteResponseDto>;

  findPrerequisitesForSubject(
    subjectId: string,
  ): Promise<SubjectPrerequisiteResponseDto[]>;

  findSubjectsRequiringPrerequisite(
    prerequisiteSubjectId: string,
  ): Promise<SubjectPrerequisiteResponseDto[]>;

  findAll(
    page: number,
    limit: number,
  ): Promise<PaginatedResponse<SubjectPrerequisiteResponseDto>>;

  count(whereOptions: any): Promise<number>;
}
