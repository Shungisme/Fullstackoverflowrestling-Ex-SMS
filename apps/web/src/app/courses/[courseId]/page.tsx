import { Alert, AlertTitle } from "@/src/components/atoms/Alert";
import { Badge } from "@/src/components/atoms/Badge";
import { Button } from "@/src/components/atoms/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/atoms/Card";
import { Separator } from "@/src/components/atoms/Separator";
import { CourseService } from "@/src/lib/api/school-service";
import { Course, CourseStatus } from "@/src/types/course";
import {
  BookOpenText,
  CalendarCheck,
  CalendarDays,
  Hash,
  Info,
  Pencil,
} from "lucide-react";

const CoursePage = async ({ params }: { params: { courseId: string } }) => {
  const course = await CourseService.getById(params.courseId);
  if (course.statusCode !== 200) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto mt-8">
        <AlertTitle>Không tìm thấy khóa học</AlertTitle>
      </Alert>
    );
  }
  const courseData: Course = course.data;

  const statusVariant =
    courseData.status === CourseStatus.ACTIVE ? "default" : "destructive";
  const statusText =
    courseData.status === CourseStatus.ACTIVE
      ? "Đang hoạt động"
      : "Ngừng hoạt động";

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold text-slate-800">
                {courseData.title}
              </CardTitle>
              <div className="text-lg text-slate-600 mt-1">
                {courseData.faculty.title}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={statusVariant} className="text-sm">
                {statusText}
              </Badge>
              <Button asChild variant="outline" className="gap-2">
                <a href={`/courses/${params.courseId}/edit`}>
                  <Pencil className="h-4 w-4" />
                  <span>Chỉnh sửa</span>
                </a>
              </Button>
            </div>
          </div>
        </CardHeader>
        <Separator className="mb-4" />

        <CardContent className="space-y-6">
          {/* Basic Information Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-4">
              <Hash className="w-6 h-6 text-slate-500 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-slate-500">
                  Mã khóa học
                </h3>
                <p className="text-lg font-semibold">{courseData.code}</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <BookOpenText className="w-6 h-6 text-slate-500 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-slate-500">
                  Số tín chỉ
                </h3>
                <p className="text-lg font-semibold">{courseData.credit}</p>
              </div>
            </div>
          </div>

          {/* Description Section */}
          {courseData.description && (
            <div className="flex items-start space-x-4">
              <Info className="w-6 h-6 text-slate-500 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-2">
                  Mô tả khóa học
                </h3>
                <p className="text-slate-700 whitespace-pre-line">
                  {courseData.description}
                </p>
              </div>
            </div>
          )}

          {/* Timeline Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-4">
              <CalendarDays className="w-6 h-6 text-slate-500 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-slate-500">Ngày tạo</h3>
                <p className="text-slate-700">
                  {courseData.createdAt?.toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <CalendarCheck className="w-6 h-6 text-slate-500 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-slate-500">
                  Cập nhật lần cuối
                </h3>
                <p className="text-slate-700">
                  {courseData.updatedAt?.toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CoursePage;
