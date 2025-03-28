import { CreateFacultyDTO } from '../../dto/create-faculty.dto';
import { FacultiesDto } from '../../dto/faculties.dto';
import { UpdateFacultyDTO } from '../../dto/update-faculty.dto';

export interface IFacultiesRepository {
  create(faculty: CreateFacultyDTO): Promise<FacultiesDto>;

  update(facultyId: string, data: UpdateFacultyDTO): Promise<FacultiesDto>;

  delete(facultyId: string): Promise<FacultiesDto>;

  findById(facultyId: string): Promise<FacultiesDto>;

  findByName(facultyName: string): Promise<FacultiesDto>;

  findAll(page: number, limit: number, status: string): Promise<FacultiesDto[]>;

  count(whereOptions: any): Promise<number>;
}

export const FACULTIES_REPOSITORY = Symbol('IFacultiesRepository');
