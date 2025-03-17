import React from "react";
import StatsList from "./StatsList";
import { getStudents } from "@/src/lib/api/student-service";

const StudentStats = async () => {
  const data = await getStudents();

  return <StatsList students={data.data.students} />;
};

export default StudentStats;
