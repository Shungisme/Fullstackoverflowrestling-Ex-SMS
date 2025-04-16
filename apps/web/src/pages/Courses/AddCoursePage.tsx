import React from "react";
import { SchoolConfigProvider } from "@/src/context/SchoolConfigContext";
import { ArrowLeft } from "lucide-react";
import AddCourseForm from "./AddCourseForm";

const AddCoursePage = () => {
  return (
    <SchoolConfigProvider>
      <div>
        <div className="flex items-center mb-4 gap-4">
          <a href="/courses">
            <ArrowLeft className="h-4 w-4 text-gray-500" />
          </a>
          <h1 className="text-2xl font-bold">Thêm môn học</h1>
        </div>
      </div>
      <AddCourseForm />
    </SchoolConfigProvider>
  );
};

export default AddCoursePage;
