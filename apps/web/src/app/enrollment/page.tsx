import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui";
import { EnrollmentForm } from "@/src/components/organisms/EnrollmentForm";
import { EnrollmentManagement } from "@/src/components/organisms/EnrollmentManagement";
import { TranscriptPrinter } from "@/src/components/organisms/TranscriptPrinter";
import { Student } from "@/src/types";
import Enrollment from "@/src/pages/Enrollment/Enrollment";

export default async function EnrollmentPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const studentId = (await searchParams).student as string | undefined;
    // If there's a student ID in URL, open the management tab by default
    return <Enrollment studentId={studentId} />;
}
