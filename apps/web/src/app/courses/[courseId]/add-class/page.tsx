"use client";
import { SchoolConfigProvider } from "@/src/context/SchoolConfigContext";
import AddClass from "@/src/pages/Courses/AddClass";
import React from "react";

const AddClassPage = ({ params }: { params: { courseId: string } }) => {
  return (
      <AddClass courseId={params.courseId} />
  );
};

export default AddClassPage;
