import { PaginatedResponse } from 'src/shared/types/PaginatedResponse';
import { CreateFacultyDTO } from '../../dto/create-faculty.dto';
import { FacultiesDto } from '../../dto/faculties.dto';
import { UpdateFacultyDTO } from '../../dto/update-faculty.dto';

export interface IFacultiesService {
  create(faculty: CreateFacultyDTO): Promise<FacultiesDto>;

  update(facultyId: string, data: UpdateFacultyDTO): Promise<FacultiesDto>;

  delete(facultyId: string): Promise<FacultiesDto>;

  findById(facultyId: string, lang?: string): Promise<FacultiesDto>;

  findAll(
    page: number,
    limit: number,
    status: string,
    lang?: string,
  ): Promise<PaginatedResponse<FacultiesDto>>;

  count(whereOptions: any): Promise<number>;
}
