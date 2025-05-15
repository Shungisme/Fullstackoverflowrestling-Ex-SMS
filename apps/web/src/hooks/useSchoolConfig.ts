"use client";

import { useEffect, useState } from "react";
import { Faculty, Program, StudentStatus } from "../types";
import {
  SemesterService,
  CourseService,
  FacultyService,
  ProgramService,
  StudentStatusService,
  CRUDService,
} from "../lib/api/school-service";
import { toast } from "sonner";
import { Course, Semester } from "../types/course";
import { useLanguage } from "../context/LanguageContext";

export default function useSchoolConfig() {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [statuses, setStatuses] = useState<StudentStatus[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { language } = useLanguage();
  const services: CRUDService<any>[] = [
    new FacultyService(language),
    new ProgramService(language),
    new StudentStatusService(language),
    new CourseService(language),
    new SemesterService(language),
  ];
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const query = ["status=active"];
      const [facultyRes, programRes, statusRes, coursesRes, semesterRes] =
        await Promise.all([
          services[0].getAll(query),
          services[1].getAll(query),
          services[2].getAll(query),
          services[3].getAll([]),
          services[4].getAll(query),
        ]);

      setFaculties(facultyRes.data.data || []);
      setPrograms(programRes.data.data || []);
      setStatuses(statusRes.data.data || []);
      setCourses(coursesRes.data.data || []);
      setSemesters(semesterRes.data.data || []);
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
