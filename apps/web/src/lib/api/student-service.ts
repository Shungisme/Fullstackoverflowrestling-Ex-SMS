import {
  APIError,
  IAPIResponse,
  Student,
  StudentDataRespose,
  StudentList,
} from "@/src/types";
import { BASE_URL, Language, ListConfig } from "@/src/constants/constants";
import { stripEmptyValues } from "@/src/utils/cleaner";
import { toQueryString } from "@/src/utils/helper";
import { StudentSearchParams } from "@/src/types/search";
import { CRUDService } from "./school-service";

const studentURL = BASE_URL + "/students";

export class StudentService extends CRUDService<Student> {
  constructor(lang: Language) {
    super(studentURL, lang);
  }

  async searchStudents(
    searchTerm: StudentSearchParams
  ): Promise<IAPIResponse<StudentList>> {
    const queryString = toQueryString(searchTerm);
    const res = await fetch(`${studentURL}?${queryString}&lang=${this.lang}`, {
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error("Failed to search students");
  }

  return res.json();
  }
}

// export async function getStudents(
//   page = ListConfig.defaultPage,
//   limit = ListConfig.rowsPerPage
// ): Promise<StudentDataRespose> {
//   const queryString = toQueryString({
//     limit,
//     page,
//   });
//   const url = `${studentURL}?${queryString}`;
//   const res = await fetch(url, { next: { revalidate: 5 } });
//   if (!res.ok) {
//     throw new Error("Failed to fetch students");
//   }

//   return res.json();
// }

// export async function getStudent(id: string): Promise<IAPIResponse<Student>> {
//   const res = await fetch(`${studentURL}/${id}`);

//   if (!res.ok) {
//     throw new Error("Failed to fetch student with id: " + id);
//   }

//   return res.json();
// }

// export async function searchStudents(
//   searchTerm: StudentSearchParams
// ): Promise<IAPIResponse<StudentList>> {
//   const queryString = toQueryString(searchTerm);
//   const res = await fetch(`${studentURL}?${queryString}`, {
//     headers: { "Content-Type": "application/json" },
//   });

//   if (!res.ok) {
//     throw new Error("Failed to search students");
//   }

//   return res.json();
// }

// export async function addStudent(
//   student: Student
// ): Promise<IAPIResponse<Student>> {
//   const res = await fetch(studentURL, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(stripEmptyValues(student)),
//   });

//   if (!res.ok) {
//     const data: APIError = await res.json();
//     // const errorString = data.errors.map((e) => e.message).join("\n");
//     throw new Error(data?.message);
//   }

//   return res.json();
// }

// export async function updateStudent(student: Student): Promise<Student> {
//   const res = await fetch(`${studentURL}/${student.studentId}`, {
//     method: "PATCH",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(stripEmptyValues(student)),
//   });

//   if (!res.ok) {
//     throw new Error("Failed to update student");
//   }

//   return res.json();
// }

// export async function deleteStudent(studentId: string): Promise<void> {
//   const res = await fetch(`${studentURL}/${studentId}`, {
//     method: "DELETE",
//     headers: { "Content-Type": "application/json" },
//   });

//   if (!res.ok) {
//     throw new Error("Failed to delete student");
//   }
// }
