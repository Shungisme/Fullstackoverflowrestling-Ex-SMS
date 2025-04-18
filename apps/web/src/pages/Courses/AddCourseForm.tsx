"use client";

import React from "react";
import CourseForm from "./CourseForm";
import { CourseService } from "@/src/lib/api/school-service";
import { toast } from "sonner";
import { CourseStatus } from "@/src/types/course";

const AddCourseForm = () => {
    return (
        <CourseForm
            onSubmit={async (data) => {
                const res = await CourseService.create({
                    code: data.code,
                    title: data.title,
                    credit: data.credit,
                    description: data.description,
                    facultyId: data.facultyId,
                    status: CourseStatus.ACTIVE,
                })
                if (res.statusCode === 201) {
                    toast.success("Thêm môn học thành công");
                    setTimeout(() => {
                        window.location.href = "/courses";
                    }, 1000);
                } else {
                    const errorMessage = res.message;
                    toast.error("Thêm môn học thất bại! " + errorMessage);
                }
            }}
        />
    );
};

export default AddCourseForm;
