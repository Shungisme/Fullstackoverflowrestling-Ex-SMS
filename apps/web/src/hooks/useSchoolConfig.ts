"use client";

import { useEffect, useState } from "react";
import { Faculty, Program, StudentStatus } from "../types";
import {
    FacultyService,
    ProgramService,
    StudentStatusService,
} from "../lib/api/school-service";
import { toast } from "sonner";

export default function useSchoolConfig() {
    const [faculties, setFaculties] = useState<Faculty[]>([]);
    const [programs, setPrograms] = useState<Program[]>([]);
    const [statuses, setStatuses] = useState<StudentStatus[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [facultyRes, programRes, statusRes] = await Promise.all([
                    FacultyService.getAll(),
                    ProgramService.getAll(),
                    StudentStatusService.getAll(),
                ]);

                setFaculties(facultyRes.data.data);
                setPrograms(programRes.data.data);
                setStatuses(statusRes.data.data);
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
    };
}
