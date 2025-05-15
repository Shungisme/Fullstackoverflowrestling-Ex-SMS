import { Alert, AlertTitle } from "@/src/components/atoms/Alert";
import { useLanguage } from "@/src/context/LanguageContext";
import { CourseService } from "@/src/lib/api/school-service";
import { ArrowLeft } from "lucide-react";
import EditCourseForm from "../EditCourseForm";

export default async function EditPage({courseId}: {courseId: string}) {
    const {language} = useLanguage();
    const service = new CourseService(language);
    const course = await service.getById(courseId);
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
            <div>
                <div className="flex items-center mb-4 gap-4">
                    <a href="/courses">
                        <ArrowLeft className="h-4 w-4 text-gray-500" />
                    </a>
                    <h1 className="text-2xl font-bold">Chỉnh sửa môn học</h1>
                </div>
                <EditCourseForm courseData={courseData} />
            </div>
    );
}