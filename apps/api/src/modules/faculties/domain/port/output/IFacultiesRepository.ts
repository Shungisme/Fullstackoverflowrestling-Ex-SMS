import { CreateFacultyDTO } from '../../dto/create-faculty.dto';
import { FacultiesDto } from '../../dto/faculties.dto';

export interface IFacultiesRepository {
  create(faculty: CreateFacultyDTO): Promise<FacultiesDto>;

  update(facultyId: string, data: CreateFacultyDTO): Promise<FacultiesDto>;

  delete(facultyId: string): Promise<FacultiesDto>;

  findById(facultyId: string): Promise<FacultiesDto>;

  findByName(facultyName: string): Promise<FacultiesDto>;

  findAll(page: number, limit: number): Promise<FacultiesDto[]>;

  count(): Promise<number>;
}

export const FACULTIES_REPOSITORY = Symbol('IFacultiesRepository');
