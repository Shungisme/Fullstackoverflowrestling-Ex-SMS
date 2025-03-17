"use client";

import { Student } from "@/src/types";
import Dashboard from "@/src/components/pages/Dashboard";

type DashboardTabProps = {
  students: Student[];
};

export default function DashboardTab({ students }: DashboardTabProps) {
  return <Dashboard students={students} />;
}
