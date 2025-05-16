"use client";
import { Alert, AlertTitle } from "@/src/components/atoms/Alert";
import { useLanguage } from "@/src/context/LanguageContext";
import { CourseService } from "@/src/lib/api/school-service";
import { ArrowLeft } from "lucide-react";
import EditCourseForm from "../EditCourseForm";
import { useEffect, useState } from "react";
import { Course } from "@/src/types/course";
import LoadingSpinner from "@/src/components/LoadingSpinner";
import { toast } from "sonner";
import { getErrorMessage } from "@/src/utils/helper";

export default function EditPage({ courseId }: { courseId: string }) {
  const { language } = useLanguage();
  const [course, setCourse] = useState<Course>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const service = new CourseService(language);
        const data = await service.getById(courseId);
        if (data.statusCode == 200) {
          setCourse(data.data);
        }
      } catch (error) {
        toast.error(getErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) return <LoadingSpinner />;

  if (!course) {
    return (
      <div className="max-w-2xl mx-auto mt-8">
        <Alert variant="destructive">
          <AlertTitle>Không tìm thấy khóa học</AlertTitle>
        </Alert>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center mb-4 gap-4">
        <a href="/courses">
          <ArrowLeft className="h-4 w-4 text-gray-500" />
        </a>
        <h1 className="text-2xl font-bold">Chỉnh sửa môn học</h1>
      </div>
      <EditCourseForm courseData={course} />
    </div>
  );
}
