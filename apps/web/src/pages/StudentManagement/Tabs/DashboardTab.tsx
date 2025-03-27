"use client";
import { Student } from "@/src/types";
import Dashboard from "@/src/components/pages/Dashboard";
import { getStudents } from "@/src/lib/api/student-service";
import { useEffect, useState } from "react";
import LoadingSpinner from "@/src/components/LoadingSpinner";

export default function DashboardTab() {
    const [students, setStudents] = useState<Student[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        getStudents(1, 1000).then((data) => {
            setStudents(data.data.students);
            setIsLoading(false);
        });
    }, []);

    if (isLoading) return <LoadingSpinner />;

    return <Dashboard students={students} />;
}
