import React from "react";
import StatsList from "./StatsList";
import { getStudents } from "@/src/lib/api/student-service";

const StudentStats = async () => {
  const data = await getStudents(1, 1000);

  return <StatsList students={data.data.students} />;
};

export default StudentStats;
