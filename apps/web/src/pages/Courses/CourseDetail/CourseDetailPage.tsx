"use client";
import { useLanguage } from "@/src/context/LanguageContext"
import { CourseService } from "@/src/lib/api/school-service";
import NoCourseAlert from "./NoCourseAlert";
import { Card, CardContent, CardHeader } from "@/src/components/atoms/Card";
import CourseDetailPageHeader from "./CourseDetailPageHeader";
import { Separator } from "@/src/components/atoms/Separator";
import BasicInfoSection from "./BasicInfoSection";
import DescriptionSection from "./DescriptionSection";
import TimelineSection from "./TimelineSection";
import { Course } from "@/src/types/course";

interface CourseDetailPageProps {
  courseId: string;
}

const CourseDetailPage = async ({courseId}: CourseDetailPageProps) => {
    const { language } = useLanguage();
    const service = new CourseService(language);
    const course = await service.getById(courseId);
  if (course.statusCode !== 200) {
    return <NoCourseAlert />;
  }
  const courseData: Course = course.data;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CourseDetailPageHeader
            courseData={courseData}
            courseId={courseId}
          />
        </CardHeader>
        <Separator className="mb-4" />

        <CardContent className="space-y-6">
          {/* Basic Information Section */}
          <BasicInfoSection courseData={courseData} />

          {/* Description Section */}
          {courseData.description && (
            <DescriptionSection courseData={courseData} />
          )}

          {/* Timeline Section */}
          <TimelineSection courseData={courseData} />
        </CardContent>
      </Card>
    </div>
  );
}

export default CourseDetailPage;