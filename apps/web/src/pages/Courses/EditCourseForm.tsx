"use client";
import React from "react";
import CourseForm from "./CourseForm";
import { Course } from "@/src/types/course";

const EditCourseForm = ({ courseData }: { courseData: Course }) => {
    return (
        <CourseForm
            variant="edit"
            defaultValues={{
                code: courseData.code,
                title: courseData.title,
                credit: courseData.credit,
                facultyId: courseData.faculty.id!,
                description: courseData.description,
            }}
            onSubmit={async () => {
                await new Promise((res) => setTimeout(res, 5000));
            }}
        />
    );
};

export default EditCourseForm;
