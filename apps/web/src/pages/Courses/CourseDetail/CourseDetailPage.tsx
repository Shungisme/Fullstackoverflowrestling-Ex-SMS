"use client";
import { useLanguage } from "@/src/context/LanguageContext";
import { CourseService } from "@/src/lib/api/school-service";
import NoCourseAlert from "./NoCourseAlert";
import { Card, CardContent, CardHeader } from "@/src/components/atoms/Card";
import CourseDetailPageHeader from "./CourseDetailPageHeader";
import { Separator } from "@/src/components/atoms/Separator";
import BasicInfoSection from "./BasicInfoSection";
import DescriptionSection from "./DescriptionSection";
import TimelineSection from "./TimelineSection";
import { Course } from "@/src/types/course";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getErrorMessage } from "@/src/utils/helper";
import LoadingSpinner from "@/src/components/LoadingSpinner";

interface CourseDetailPageProps {
  courseId: string;
}

const CourseDetailPage = ({ courseId }: CourseDetailPageProps) => {
  const { language, t } = useLanguage();
  const [course, setCourse] = useState<Course>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const service = new CourseService(language);
        const data = await service.getById(courseId);
        if (data.statusCode === 200) {
          setCourse(data.data);
        }
      } catch (e) {
        toast.error(getErrorMessage(e));
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) return <LoadingSpinner />;
  if (!course) return <NoCourseAlert />;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CourseDetailPageHeader courseData={course} courseId={courseId} />
        </CardHeader>
        <Separator className="mb-4" />

        <CardContent className="space-y-6">
          {/* Basic Information Section */}
          <BasicInfoSection courseData={course} />

          {/* Description Section */}
          {course.description && <DescriptionSection courseData={course} />}

          {/* Timeline Section */}
          <TimelineSection courseData={course} />
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseDetailPage;
