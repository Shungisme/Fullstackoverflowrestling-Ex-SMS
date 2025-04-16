import { CreateSemesterDTO } from '../../dto/create-semester.dto';
import { SemesterDto } from '../../dto/semester.dto';
import { UpdateSemesterDTO } from '../../dto/update-semester.dto';

export interface ISemesterRepository {
  create(semester: CreateSemesterDTO): Promise<SemesterDto>;

  update(semesterId: string, data: UpdateSemesterDTO): Promise<SemesterDto>;

  delete(semesterId: string): Promise<SemesterDto>;

  findById(semesterId: string): Promise<SemesterDto>;

  findByAcademicYearAndSemester(
    academicYear: string,
    semester: number,
  ): Promise<SemesterDto>;

  findAll(page: number, limit: number): Promise<SemesterDto[]>;

  count(whereOptions: any): Promise<number>;
}

export const SEMESTER_REPOSITORY = Symbol('ISemesterRepository');
