import { Faculty, IAPIResponse, Program, StudentStatus } from "@/src/types";
import { BASE_URL, Language } from "@/src/constants/constants";
import { Class, ClassResult, Course, Semester } from "@/src/types/course";

export interface PaginatedResponse<T> {
    data: T[];
    page: number;
    totalPage: number;
    limit: number;
    total: number;
}

export abstract class CRUDService<T> {
    protected endpoint: string;
    protected lang: Language;

    constructor(endpoint: string, lang?: Language) {
        this.endpoint = endpoint;
        this.lang = lang || Language.VIETNAMESE;
    }

    setLanguage(lang: Language) {
        this.lang = lang;
    }

    async getAll(query?: string[]): Promise<IAPIResponse<PaginatedResponse<T>>> {
        const queryString = query && query.length > 0 ? query.join("&") : "";
        const response = await fetch(`${this.endpoint}?${queryString}&lang=${this.lang}`);
        return response.json();
    }

    async getById(id: number | string): Promise<IAPIResponse<T>> {
        const response = await fetch(`${this.endpoint}/${id}?lang=${this.lang}`, {
            cache: "no-store",
        });
        return response.json();
    }

    async create(data: Partial<T>): Promise<IAPIResponse<T>> {
        const response = await fetch(`${this.endpoint}`, {
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

// export const FacultyService = new CRUDService<Faculty>(`${BASE_URL}/faculties`);
export class FacultyService extends CRUDService<Faculty> {
    constructor(lang: Language) {
        super(`${BASE_URL}/faculties`, lang);
    }
}
export class StudentStatusService extends CRUDService<StudentStatus> {
    constructor(lang: Language) {
        super(`${BASE_URL}/student-statuses`, lang);
    }
}
export class ProgramService extends CRUDService<Program> {
    constructor(lang: Language) {
        super(`${BASE_URL}/programs`, lang);
    }
}
export class CourseService extends CRUDService<Course> {
    constructor(lang: Language) {
        super(`${BASE_URL}/subjects`, lang);
    }
}
export class SemesterService extends CRUDService<Semester> {
    constructor(lang: Language) {
        super(`${BASE_URL}/semesters`, lang);
    }
}
export class ClassService extends CRUDService<Class> {
    constructor(lang: Language) {
        super(`${BASE_URL}/classes`, lang);
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

export class ClassResultService extends CRUDService<ClassResult> {
    constructor(lang: Language) {
        super(`${BASE_URL}/student-class-results`, lang);
    }

    async getStudentResults(
        studentId: string,
    ): Promise<IAPIResponse<PaginatedResponse<ClassResult>>> {
        const response = await fetch(`${this.endpoint}/student/${studentId}?lang=${this.lang}`);
        return response.json();
    }
    async getClassResults(
        classCode: string,
    ): Promise<IAPIResponse<PaginatedResponse<ClassResult>>> {
        const response = await fetch(`${this.endpoint}/class/${classCode}?lang=${this.lang}`);
        return response.json();
    }
    async getStudentClassResult(
        studentId: string,
        classCode: string,
    ): Promise<IAPIResponse<ClassResult>> {
        const response = await fetch(
            `${this.endpoint}/student/${studentId}/class/${classCode}?lang=${this.lang}`,
        );
        return response.json();
    }
}
