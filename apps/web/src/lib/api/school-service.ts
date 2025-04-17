import { Faculty, IAPIResponse, Program, StudentStatus } from "@/src/types";
import { BASE_URL } from "@/src/constants/constants";
import { Class, ClassResult, Course, Semester } from "@/src/types/course";

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  totalPage: number;
  limit: number;
  total: number;
}

export class CRUDService<T> {
  private endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  async getAll(query?: string[]): Promise<IAPIResponse<PaginatedResponse<T>>> {
    const queryString = query && query.length > 0 ? query.join("&") : "";
    const response = await fetch(`${this.endpoint}?${queryString}`);
    return response.json();
  }

  async getById(id: number | string): Promise<IAPIResponse<T>> {
    const response = await fetch(`${this.endpoint}/${id}`);
    return response.json();
  }

  async create(data: Partial<T>): Promise<IAPIResponse<T>> {
    const response = await fetch(this.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async update(
    id: number | string,
    data: Partial<T>,
  ): Promise<IAPIResponse<T>> {
    const response = await fetch(`${this.endpoint}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async delete(id: number | string): Promise<IAPIResponse<T>> {
    const response = await fetch(`${this.endpoint}/${id}`, {
      method: "DELETE",
    });
    return response.json();
  }
}

export const FacultyService = new CRUDService<Faculty>(`${BASE_URL}/faculties`);
export const StudentStatusService = new CRUDService<StudentStatus>(
  `${BASE_URL}/statuses`,
);
export const ProgramService = new CRUDService<Program>(`${BASE_URL}/programs`);
// Will use this later. Currently, we will use mock for this Course Service
export const CourseService = new CRUDService<Course>(`${BASE_URL}/subjects`);
export const SemesterService = new CRUDService<Semester>(
  `${BASE_URL}/semesters`,
);
export class ClassService extends CRUDService<Class> {
  constructor() {
    super(`${BASE_URL}/classes`);
  }

  async getClassResultsOfStudent(
    studentId: string,
    classCode: string,
  ): Promise<IAPIResponse<ClassResult[]>> {
    const response = await fetch(
      `${BASE_URL}/student-class-results/student/${studentId}/class/${classCode}`,
    );
    return response.json();
  }
  async getAllClassesByCourseCode(
    courseCode: string,
    semesterId?: string,
  ): Promise<IAPIResponse<Class[]>> {
    const response = await this.getAll([
      `subjectCode=${courseCode}`,
      `semesterCode=${semesterId}`,
    ]);

    return {
      data: response.data.data,
      statusCode: response.statusCode,
      message: response.message,
    };
  }
}
