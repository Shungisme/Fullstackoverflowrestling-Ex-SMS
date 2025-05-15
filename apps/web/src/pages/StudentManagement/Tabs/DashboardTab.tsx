"use client";
import { Student } from "@/src/types";
import Dashboard from "@/src/components/pages/Dashboard";
import { StudentService } from "@/src/lib/api/student-service";
import { useEffect, useState } from "react";
import LoadingSpinner from "@/src/components/LoadingSpinner";
import { useLanguage } from "@/src/context/LanguageContext";

export default function DashboardTab() {
    const [students, setStudents] = useState<Student[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const {language} = useLanguage();


    useEffect(() => {
        const service = new StudentService(language);
        service.getAll(["page=1", "limit=1000"]).then((data) => {
            setStudents(data.data.data);
            setIsLoading(false);
        });
    }, []);

    if (isLoading) return <LoadingSpinner />;

    return <Dashboard students={students} />;
}
