// lib/api/student-service.ts
import { Student, StudentDataRespose, StudentList } from "@/src/types";
import { BASE_URL, ListConfig } from "@/src/constants/constants";
import { stripEmptyValues } from "@/src/utils/cleaner";
import { toQueryString } from "@/src/utils/helper";

export async function getStudents(
  page = ListConfig.defaultPage,
): Promise<StudentDataRespose> {
  const queryString = toQueryString({
    limit: ListConfig.rowsPerPage,
    page,
  });
  const url = `${BASE_URL}?${queryString}`;
  const res = await fetch(url, { next: { revalidate: 60 } });

  if (!res.ok) {
    throw new Error("Failed to fetch students");
  }

  return res.json();
}

export async function searchStudents(searchTerm: string): Promise<StudentList> {
  const queryString = toQueryString({
    key: searchTerm,
  });

  const res = await fetch(`${BASE_URL}?${queryString}`, {
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error("Failed to search students");
  }

  return res.json();
}

export async function addStudent(student: Student): Promise<Student> {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(stripEmptyValues(student)),
  });

  if (!res.ok) {
    throw new Error("Failed to add student");
  }

  return res.json();
}

export async function updateStudent(student: Student): Promise<Student> {
  const res = await fetch(`${BASE_URL}/${student.studentId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(stripEmptyValues(student)),
  });

  if (!res.ok) {
    throw new Error("Failed to update student");
  }

  return res.json();
}

export async function deleteStudent(studentId: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/${studentId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error("Failed to delete student");
  }
}
