"use client";

import { StudentProvider } from "@/src/context/StudentContext";
import StudentManagementTabs from "./Tabs/StudentManagementTabs";
import { SchoolConfigProvider } from "@/src/context/SchoolConfigContext";

export default function StudentManagementClient() {
  return (
    <SchoolConfigProvider>
      <StudentManagementTabs />
    </SchoolConfigProvider>
  );
}
