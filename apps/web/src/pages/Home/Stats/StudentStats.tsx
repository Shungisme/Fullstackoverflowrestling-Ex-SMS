"use client";
import React from "react";
import StatsList from "./StatsList";
import { useStudentContext } from "@/src/context/StudentContext";

const StudentStats = async () => {
  const { allStudents } = useStudentContext();

  if (!allStudents) {
    return null;
  }
  return <StatsList students={allStudents.students} />;
};

export default StudentStats;
