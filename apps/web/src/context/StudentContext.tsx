"use client";

import { 
  createContext, 
  useContext, 
  ReactNode,
  useMemo
} from "react";
import { Student, StudentList } from "../types";
import { useStudents } from "../hooks/useStudents";

type StudentContextType = {
  students: StudentList;
  isLoading: boolean;
  addStudent: (student: Student) => Promise<boolean>;
  updateStudent: (student: Student) => Promise<boolean>;
  deleteStudent: (studentId: string) => Promise<void>;
  searchStudents: (searchTerm: string) => Promise<void>;
  handlePageChange: (page: number) => boolean;
};

const StudentContext = createContext<StudentContextType | undefined>(undefined);

type StudentProviderProps = {
  children: ReactNode;
};

export function StudentProvider({ children }: StudentProviderProps) {
  const {
    students,
    isLoading,
    addStudent,
    updateStudent,
    deleteStudent,
    searchStudents,
    handlePageChange
  } = useStudents();

  const value = useMemo(
    () => ({
      students,
      isLoading,
      addStudent,
      updateStudent,
      deleteStudent,
      searchStudents,
      handlePageChange
    }),
    [students, isLoading, addStudent, updateStudent, deleteStudent, searchStudents, handlePageChange]
  );

  return (
    <StudentContext.Provider value={value}>
      {children}
    </StudentContext.Provider>
  );
}

export function useStudentContext() {
  const context = useContext(StudentContext);
  if (context === undefined) {
    throw new Error("useStudentContext must be used within a StudentProvider");
  }
  return context;
}
