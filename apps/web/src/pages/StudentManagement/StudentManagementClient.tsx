"use client";

import { SchoolConfigProvider } from "@/src/context/SchoolConfigContext";
import StudentManagementTabs from "./Tabs/StudentManagementTabs";

export default function StudentManagementClient() {
  return (
      <StudentManagementTabs />
  );
}
