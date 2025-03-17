"use client";

import { StudentProvider } from "@/src/context/StudentContext";
import StudentManagementTabs from "./Tabs/StudentManagementTabs";

export default function StudentManagementClient() {
  return (
    <StudentProvider>
      <StudentManagementTabs />
    </StudentProvider>
  );
}
