import { PaginatedResponse } from 'src/shared/types/PaginatedResponse';
import { CreateFacultyDTO } from '../../dto/create-faculty.dto';
import { FacultiesDto } from '../../dto/faculties.dto';

export interface IFacultiesService {
  create(faculty: CreateFacultyDTO): Promise<FacultiesDto>;

  update(facultyId: string, data: CreateFacultyDTO): Promise<FacultiesDto>;

  delete(facultyId: string): Promise<FacultiesDto>;

  findById(facultyId: string): Promise<FacultiesDto>;

  findAll(
    page: number,
    limit: number,
  ): Promise<PaginatedResponse<FacultiesDto>>;

  count(): Promise<number>;
}
