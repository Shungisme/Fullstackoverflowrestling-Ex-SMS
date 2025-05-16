import CourseDetailPage from "@/src/pages/Courses/CourseDetail/CourseDetailPage";

const CoursePage = async ({ params }: { params: { courseId: string } }) => {
  return <CourseDetailPage courseId={params.courseId} />;
};

export default CoursePage;
