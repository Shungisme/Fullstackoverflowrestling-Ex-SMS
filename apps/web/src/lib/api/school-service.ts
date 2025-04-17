import { toQueryString } from "@/src/utils/helper";
import {
  APIError,
  Faculty,
  IAPIResponse,
  Program,
  StudentStatus,
} from "@/src/types";
import { BASE_URL } from "@/src/constants/constants";
import { Course, CourseStatus } from "@/src/types/course";

interface PaginatedResponse<T> {
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
// export const CourseService = new CRUDService<any>(`${BASE_URL}/courses`);
export const CourseService = {
  getAll: async (
    query?: string[],
  ): Promise<IAPIResponse<PaginatedResponse<Course>>> => {
    return Promise.resolve({
      data: {
        data: [
          {
            id: "1",
            code: "CS101",
            title: "Introduction to Computer Science",
            credit: 3,
            faculty: {
              id: "1",
              title: "Computer Science",
              description: "This is the Computer Science faculty.",
              status: "active",
            },
            description: "This course covers the basics of computer science.",
            status: CourseStatus.ACTIVE,
          },
          {
            id: "2",
            code: "CS102",
            title: "Data Structures and Algorithms",
            credit: 3,
            faculty: {
              id: "1",
              title: "Computer Science",
              description: "This is the Computer Science faculty.",
              status: "active",
            },
            description:
              "This course covers the basics of data structures and algorithms.",
            status: CourseStatus.INACTIVE,
          },
        ],
        page: 1,
        totalPage: 1,
        limit: 10,
        total: 2,
      },
      statusCode: 200,
      message: "Success",
    });
  },
  getById: async (id: number | string): Promise<IAPIResponse<Course>> => {
    return Promise.resolve({
      data: {
        id: id.toString(),
        code: "CS101",
        title: "Introduction to Computer Science",
        credit: 3,
        faculty: {
          id: "1",
          title: "Computer Science",
          description: "This is the Computer Science faculty.",
          status: "active",
        },
        description: "This course covers the basics of computer science.",
        status: CourseStatus.ACTIVE,
      },
      statusCode: 200,
      message: "Success",
    });
  },
  create: async (data: Course): Promise<IAPIResponse<Course>> => {
    return Promise.resolve({
      data: data,
      statusCode: 200,
      message: "Success",
    });
  },
  update: async (
    id: number | string,
    data: Course,
  ): Promise<IAPIResponse<Course>> => {
    return Promise.resolve({
      data: { ...data, id: id.toString() },
      statusCode: 200,
      message: "Success",
    });
  },
  delete: async (id: number | string): Promise<IAPIResponse<Course>> => {
    return Promise.resolve({
      data: {
        id: id.toString(),
        code: "CS101",
        title: "Introduction to Computer Science",
        credit: 3,
        faculty: {
          id: "1",
          title: "Computer Science",
          description: "This is the Computer Science faculty.",
          status: "active",
        },
        description: "This course covers the basics of computer science.",
        status: CourseStatus.ACTIVE,
      },
      statusCode: 200,
      message: "Success",
    });
  },
};


