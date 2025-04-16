"use client";
import React from "react";
import AddClassForm from "./AddClassForm";
import { useSchoolConfigContext } from "@/src/context/SchoolConfigContext";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const AddClass = ({ courseId }: { courseId: string }) => {
  const { courses } = useSchoolConfigContext();
  const course = courses?.find((course) => course.id === courseId);
  if (!course) {
    return <div>Course not found</div>;
  }
  return (
    <>
      <div className="text-2xl font-bold mb-4">
        <Link href={`/courses/${courseId}`} className="text-base hover:scale-150">
            <ArrowLeft className="inline mr-2 h-4" />
            Quay lại
        </Link>
        <h1>Thêm lớp học cho môn học {course.title}</h1>
      </div>
      <AddClassForm
        onSubmit={async (value) => {
          console.log(value);
        }}
        subjectCourse={course.title}
      />
    </>
  );
};

export default AddClass;
