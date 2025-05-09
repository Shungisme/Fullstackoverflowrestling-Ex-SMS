"use client";

import { useState, useEffect } from "react";
import { Student, StudentDataRespose, StudentList } from "../types";
import { toast } from "sonner";
import {
  getStudents,
  searchStudents as searchStudentsApi,
  addStudent as addStudentApi,
  updateStudent as updateStudentApi,
  deleteStudent as deleteStudentApi,
} from "../lib/api/student-service";
import { ListConfig } from "../constants/constants";
import { StudentSearchParams } from "../types/search";

export function useStudents() {
  const [students, setStudents] = useState<StudentList>({
    students: [],
    total: 0,
  });
  const [allStudents, setAllStudents] = useState<StudentList>({
    students: [],
    total: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);
  const [page, setPage] = useState(ListConfig.defaultPage);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [data, allData] = await Promise.all([
        await getStudents(page),
        await getStudents(1, 1000),
      ]);
      setStudents(data.data);
      setAllStudents(allData.data);
    } catch (e) {
      toast.error("Có lỗi server diễn ra!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  const handlePageChange = (page: number): boolean => {
    if (page <= 0) return false;
    if (!Number.isInteger(page)) return false;
    setPage(page);
    return true;
  };

  const addStudent = async (newStudent: Student): Promise<boolean> => {
    try {
      const student = await addStudentApi(newStudent);

      if (!student) {
        toast.error("Không thể thêm sinh viên mới vào hệ thống");
        return false;
      }
      await fetchData();
      toast.success("Đã thêm sinh viên mới vào hệ thống");
      return true;
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Đã xảy ra lỗi không xác định";
      toast.error(message);
      return false;
    }
  };

  const updateStudent = async (updatedStudent: Student): Promise<boolean> => {
    try {
      await updateStudentApi(updatedStudent);
      await fetchData();
      toast.success("Đã cập nhật thông tin sinh viên");
      return true;
    } catch (e) {
      toast.error("Không thể cập nhật được sinh viên!");
      return false;
    }
  };

  const confirmDeleteStudent = (studentId: string): void => {
    setStudentToDelete(studentId);
    setDeleteConfirmOpen(true);
  };

  const deleteStudent = async (studentId: string): Promise<void> => {
    try {
      await deleteStudentApi(studentId);
      await fetchData();
      toast.info("Sinh viên đã được xóa khỏi hệ thống");
    } catch (e) {
      toast.error("Không thể xóa được sinh viên!");
    }
  };

  const searchStudents = async (searchTerm: StudentSearchParams): Promise<void> => {
    try {
      setIsLoading(true);
      const data = await searchStudentsApi(searchTerm);
      setStudents(data.data);
    } catch (e) {
      toast.error("Có lỗi server diễn ra!");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    students,
    allStudents,
    isLoading,
    deleteConfirmOpen,
    studentToDelete,
    setDeleteConfirmOpen,
    addStudent,
    updateStudent,
    confirmDeleteStudent,
    deleteStudent,
    searchStudents,
    handlePageChange,
  };
}
