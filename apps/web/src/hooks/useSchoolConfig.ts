"use client";

import { useEffect, useState } from "react";
import { Faculty, Program, StudentStatus } from "../types";
import {
  CourseService,
  FacultyService,
  ProgramService,
  SemesterService,
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
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const query = ["status=active"];
      const [facultyRes, programRes, statusRes, coursesRes, semesterRes] =
        await Promise.all([
          FacultyService.getAll(query),
          ProgramService.getAll(query),
          StudentStatusService.getAll(query),
          CourseService.getAll(),
          SemesterService.getAll(),
        ]);

      setFaculties(facultyRes.data.data);
      setPrograms(programRes.data.data);
      setStatuses(statusRes.data.data);
      setCourses(coursesRes.data.data);
      setSemesters(semesterRes.data.data);
    } catch {
      toast.error("Internal Server Error!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    isLoading,
    faculties,
    programs,
    statuses,
    courses,
    semesters,
    fetchData,
  };
}
