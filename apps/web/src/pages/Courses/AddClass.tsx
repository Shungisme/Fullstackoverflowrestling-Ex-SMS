"use client";
import React from "react";
import AddClassForm from "./AddClassForm";
import { useSchoolConfigContext } from "@/src/context/SchoolConfigContext";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import LoadingSpinner from "@/src/components/LoadingSpinner";
import { ClassService } from "@/src/lib/api/school-service";
import { toast } from "sonner";

const AddClass = ({ courseId }: { courseId: string }) => {
  const { courses, isLoading } = useSchoolConfigContext();
  const course = courses?.find((course) => course.id === courseId);
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!course) {
    return <div>Course not found</div>;
  }
  return (
    <>
      <div className="text-2xl font-bold mb-4">
        <Link
          href={`/courses/${courseId}`}
          className="text-base hover:scale-150"
        >
          <ArrowLeft className="inline mr-2 h-4" />
          Quay lại
        </Link>
        <h1>Thêm lớp học cho môn học {course.title}</h1>
      </div>
      <AddClassForm
        onSubmit={async (value) => {
          const classService = new ClassService();
          const res = await classService.create({
            ...value,
            subjectCode: value.courseId,
          });
          if (res.statusCode === 201) {
            toast.success("Thêm lớp học thành công");
            setTimeout(() => {
              window.location.href = `/courses/${courseId}`;
            }, 1000);
          } else {
            const errorMessage = res.message;
            toast.error("Thêm lớp học thất bại" + errorMessage);
          }
        }}
        subjectCourse={course}
      />
    </>
  );
};

export default AddClass;
