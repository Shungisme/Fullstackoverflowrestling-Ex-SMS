import { Alert, AlertTitle } from "@/src/components/atoms/Alert";
import { SchoolConfigProvider } from "@/src/context/SchoolConfigContext";
import { CourseService } from "@/src/lib/api/school-service";
import EditCourseForm from "@/src/pages/Courses/EditCourseForm";
import { ArrowLeft } from "lucide-react";
import React from "react";

const EditCoursePage = async ({ params }: { params: { courseId: string } }) => {
    const course = await CourseService.getById(params.courseId);
    if (course.statusCode !== 200) {
        return (
            <div className="max-w-2xl mx-auto mt-8">
                <Alert variant="destructive">
                    <AlertTitle>Không tìm thấy khóa học</AlertTitle>
                </Alert>
            </div>
        );
    }
    const courseData = course.data;
    return (
        <SchoolConfigProvider>
            <div>
                <div className="flex items-center mb-4 gap-4">
                    <a href="/courses">
                        <ArrowLeft className="h-4 w-4 text-gray-500" />
                    </a>
                    <h1 className="text-2xl font-bold">Chỉnh sửa môn học</h1>
                </div>
                <EditCourseForm courseData={courseData} />
            </div>
        </SchoolConfigProvider>
    );
};

export default EditCoursePage;
