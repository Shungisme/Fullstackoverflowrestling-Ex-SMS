"use client";

import { useEffect, useState } from "react";
import { Faculty, Program, StudentStatus } from "../types";
import {
  CourseService,
  FacultyService,
  ProgramService,
  StudentStatusService,
} from "../lib/api/school-service";
import { toast } from "sonner";
import { Course, Semester } from "../types/course";

export default function useSchoolConfig() {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [statuses, setStatuses] = useState<StudentStatus[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const query = ["status=active"];
        const [facultyRes, programRes, statusRes, coursesRes] =
          await Promise.all([
            FacultyService.getAll(query),
            ProgramService.getAll(query),
            StudentStatusService.getAll(query),
            CourseService.getAll(query),
          ]);

        setFaculties(facultyRes.data.data);
        setPrograms(programRes.data.data);
        setStatuses(statusRes.data.data);
        setCourses(coursesRes.data.data);
        setSemesters([
          {
            id: "1",
            academicYear: "2023-2024",
            semester: 1,
            startDate: new Date("2023-09-01"),
            endDate: new Date("2024-01-31"),
          },
          {
            id: "2",
            academicYear: "2023-2024",
            semester: 2,
            startDate: new Date("2024-02-01"),
            endDate: new Date("2024-06-30"),
          },
        ]);
      } catch {
        toast.error("Internal Server Error!");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return {
    isLoading,
    faculties,
    programs,
    statuses,
    courses,
    semesters,
  };
}
