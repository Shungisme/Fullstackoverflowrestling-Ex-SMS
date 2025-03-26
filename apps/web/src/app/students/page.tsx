"use client";
import LoadingSpinner from "@/src/components/LoadingSpinner";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
// Currently redirect to the homepage, will implement the actual page later
const StudentPage = () => {
    const router = useRouter();

    useEffect(() => {
        router.push("/");
    }, []);

    return <LoadingSpinner />;
};

export default StudentPage;
