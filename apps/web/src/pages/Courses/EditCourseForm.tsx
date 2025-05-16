"use client";
import React from "react";
import CourseForm from "./CourseForm";
import { Course } from "@/src/types/course";
import { CourseService } from "@/src/lib/api/school-service";
import { toast } from "sonner";
import { useLanguage } from "@/src/context/LanguageContext";

const EditCourseForm = ({ courseData }: { courseData: Course }) => {
    if (!courseData) {
        return <div>Không tìm thấy thông tin môn học</div>;
    }
    const { language } = useLanguage();
    const service = new CourseService(language);
    return (
        <CourseForm
            variant="edit"
            defaultValues={{
                id: courseData.id,
                code: courseData.code,
                title: courseData.title,
                credit: courseData.credit,
                facultyId: courseData.faculty.id!,
                description: courseData.description,
            }}
            onSubmit={async (data) => {
                const res = await service.update(data.id!, {
                    code: data.code,
                    title: data.title,
                    credit: data.credit,
                    description: data.description,
                    facultyId: data.facultyId,
                })
                if (res.statusCode === 200) {
                    toast.success("Cập nhật thành công");
                    setTimeout(() => {
                        window.location.href = "/courses";
                    }, 1000);
                } else {
                    const errorMessage = res.message;
                    toast.error("Cập nhật thất bại! " + errorMessage);
                }
            }}
        />
    );
};

export default EditCourseForm;
