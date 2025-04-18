"use client";

import { createContext, useContext, ReactNode, useMemo } from "react";
import { Faculty, Program, StudentStatus } from "../types";
import useSchoolConfig from "../hooks/useSchoolConfig";
import { Course, Semester } from "../types/course";

type SchoolConfigContextType = {
  faculties: Faculty[];
  statuses: StudentStatus[];
  programs: Program[];
  courses: Course[];
  semesters?: Semester[];
  isLoading?: boolean;
};

const contextValue = {
  faculties: [],
  statuses: [],
  programs: [],
  courses: [],
};

const SchoolConfigContext =
  createContext<SchoolConfigContextType>(contextValue);

type SchoolConfigProviderProps = {
  children: ReactNode;
};

export function SchoolConfigProvider({ children }: SchoolConfigProviderProps) {
  const { faculties, statuses, programs, courses, semesters, isLoading } = useSchoolConfig();

  const value = useMemo(
    () => ({
      faculties,
      statuses,
      programs,
      courses,
      semesters,
      isLoading,
    }),
    [faculties, statuses, programs, courses, semesters, isLoading]
  );

  return (
    <SchoolConfigContext.Provider value={value}>
      {children}
    </SchoolConfigContext.Provider>
  );
}

export function useSchoolConfigContext() {
  const context = useContext(SchoolConfigContext);
  if (context === undefined) {
    throw new Error(
      "useSchoolConfigContext must be used within a SchoolConfigProvider"
    );
  }
  return context;
}
