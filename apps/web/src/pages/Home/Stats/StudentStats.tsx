"use client";
import React from "react";
import StatsList from "./StatsList";
import { useStudentContext } from "@/src/context/StudentContext";

const StudentStats = () => {
  const { allStudents } = useStudentContext();

  if (!allStudents) {
    return <div></div>;
  }
  return <StatsList students={allStudents.students} />;
};

export default StudentStats;
