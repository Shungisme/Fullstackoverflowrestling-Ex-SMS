import { toQueryString } from "@/src/utils/helper";
import { Faculty, IAPIResponse, Program, StudentStatus } from "@/src/types";
import { BASE_URL } from "@/src/constants/constants";
type PaginationRequestParams = {
    limit: number;
    page: number;
};

class CRUDService<T> {
    private endpoint: string;

    constructor(endpoint: string) {
        this.endpoint = endpoint;
    }

    async getAll(): Promise<IAPIResponse<T[]>> {
        //const queryString = toQueryString(params);
        const response = await fetch(`${this.endpoint}`);
        return response.json();
    }

    async getById(id: number | string): Promise<T> {
        const response = await fetch(`${this.endpoint}/${id}`);
        return response.json();
    }

    async create(data: Partial<T>): Promise<T> {
        const response = await fetch(this.endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        return response.json();
    }

    async update(id: number | string, data: Partial<T>): Promise<T> {
        const response = await fetch(`${this.endpoint}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        return response.json();
    }

    async delete(id: number | string): Promise<void> {
        await fetch(`${this.endpoint}/${id}`, {
            method: "DELETE",
        });
    }
}

export const FacultyService = new CRUDService<Faculty>(`${BASE_URL}/faculties`);
export const StudentStatusService = new CRUDService<StudentStatus>(
    `${BASE_URL}/student-statuses`,
);
export const ProgramService = new CRUDService<Program>(`${BASE_URL}/programs`);
