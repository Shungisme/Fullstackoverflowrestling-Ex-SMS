"use client";

import { createContext, useContext, ReactNode, useMemo } from "react";
import { Student, StudentList } from "../types";
import { useStudents } from "../hooks/useStudents";
import { StudentSearchParams } from "../types/search";

type StudentContextType = {
  students: StudentList;
  allStudents: StudentList;
  isLoading: boolean;
  addStudent: (student: Student) => Promise<boolean>;
  updateStudent: (student: Student) => Promise<boolean>;
  deleteStudent: (studentId: string) => Promise<void>;
  searchStudents: (searchTerm: StudentSearchParams) => Promise<void>;
  handlePageChange: (page: number) => boolean;
};

const contextValue = {
  students: { students: [], total: 0 },
  allStudents: { students: [], total: 0 },
  isLoading: false,
  addStudent: async () => false,
  updateStudent: async () => false,
  deleteStudent: async () => {},
  searchStudents: async () => {},
  handlePageChange: () => false,
};

const StudentContext = createContext<StudentContextType>(contextValue);

type StudentProviderProps = {
  children: ReactNode;
};

export function StudentProvider({ children }: StudentProviderProps) {
  const {
    students,
    allStudents,
    isLoading,
    addStudent,
    updateStudent,
    deleteStudent,
    searchStudents,
    handlePageChange,
  } = useStudents();

  const value = useMemo(
    () => ({
      students,
      allStudents,
      isLoading,
      addStudent,
      updateStudent,
      deleteStudent,
      searchStudents,
      handlePageChange,
    }),
    [
      students,
      allStudents,
      isLoading,
      addStudent,
      updateStudent,
      deleteStudent,
      searchStudents,
      handlePageChange,
    ]
  );

  return (
    <StudentContext.Provider value={value}>{children}</StudentContext.Provider>
  );
}

export function useStudentContext() {
  const context = useContext(StudentContext);
  if (context === undefined) {
    throw new Error("useStudentContext must be used within a StudentProvider");
  }
  return context;
}
