import { Card, CardContent, CardHeader } from "@/src/components/atoms/Card";
import { Separator } from "@/src/components/atoms/Separator";
import { CourseService } from "@/src/lib/api/school-service";
import BasicInfoSection from "@/src/pages/Courses/CourseDetail/BasicInfoSection";
import CourseDetailPageHeader from "@/src/pages/Courses/CourseDetail/CourseDetailPageHeader";
import DescriptionSection from "@/src/pages/Courses/CourseDetail/DescriptionSection";
import NoCourseAlert from "@/src/pages/Courses/CourseDetail/NoCourseAlert";
import TimelineSection from "@/src/pages/Courses/CourseDetail/TimelineSection";
import { Course } from "@/src/types/course";

const CoursePage = async ({ params }: { params: { courseId: string } }) => {
  const course = await CourseService.getById(params.courseId);
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
            courseId={params.courseId}
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
};

export default CoursePage;
