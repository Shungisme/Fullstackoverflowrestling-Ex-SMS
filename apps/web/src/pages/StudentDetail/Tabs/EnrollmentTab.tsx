import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/atoms/Card';
import { Enrollment, EnrollmentStatus } from '@/src/types/enrollment';
import { Badge } from '@/src/components/atoms/Badge';
import { CalendarClock, GraduationCap } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/atoms/Table';
import { Button } from '@/src/components/atoms/Button';
import { Student } from '@/src/types';
import { getStudentEnrollments } from '@/src/lib/api/enrollment-service';

interface EnrollmentTabProps {
  student: Student;
}

const getStatusBadgeVariant = (status: EnrollmentStatus) => {
  switch (status) {
    case EnrollmentStatus.ACTIVE:
      return "default";
    case EnrollmentStatus.COMPLETED:
      return "default"; // Adjusted to match allowed values
    case EnrollmentStatus.CANCELLED:
      return "destructive";
    case EnrollmentStatus.PENDING:
      return "outline";
    default:
      return "secondary";
  }
};

const getStatusDisplay = (status: EnrollmentStatus) => {
  switch (status) {
    case EnrollmentStatus.ACTIVE:
      return "Đang học";
    case EnrollmentStatus.COMPLETED:
      return "Đã hoàn thành";
    case EnrollmentStatus.CANCELLED:
      return "Đã hủy";
    case EnrollmentStatus.PENDING:
      return "Chờ xử lý";
    default:
      return status;
  }
};

const EnrollmentTab: React.FC<EnrollmentTabProps> = ({ student }) => {
  const [enrollments, setEnrollments] = React.useState<Enrollment[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchStudentEnrollments() {
      try {
        const response = await getStudentEnrollments(student.studentId);
        setEnrollments(response.data || []);
      } catch (error) {
        console.error("Failed to load student enrollments:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (student.studentId) {
      fetchStudentEnrollments();
    }
  }, [student.studentId]);

  // Filter enrollments by status
  const currentEnrollments = enrollments.filter(e => e.status === EnrollmentStatus.ACTIVE);
  const pastEnrollments = enrollments.filter(e => e.status !== EnrollmentStatus.ACTIVE);

  // Calculate GPA based on completed courses
  const completedCourses = enrollments.filter(e => e.status === EnrollmentStatus.COMPLETED);
  const totalCredits = completedCourses.reduce((sum, e) => sum + (e.course?.credit || 0), 0);
  const totalGradePoints = completedCourses.reduce((sum, e) => {
    const gradeValue = e.grade?.total || 0;
    return sum + (gradeValue * (e.course?.credit || 0));
  }, 0);
  
  const gpa = totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : "N/A";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          Thông tin học tập
        </CardTitle>
        <CardDescription>
          Quản lý thông tin khóa học và kết quả học tập của {student.name}
        </CardDescription>
        
        {/* Summary Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="bg-muted rounded-md p-4">
            <div className="text-sm text-muted-foreground">Tổng số môn học</div>
            <div className="text-2xl font-bold">{enrollments.length}</div>
          </div>
          <div className="bg-muted rounded-md p-4">
            <div className="text-sm text-muted-foreground">Đang theo học</div>
            <div className="text-2xl font-bold">{currentEnrollments.length}</div>
          </div>
          <div className="bg-muted rounded-md p-4">
            <div className="text-sm text-muted-foreground">Điểm trung bình (GPA)</div>
            <div className="text-2xl font-bold">{gpa}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {/* Current Enrollments */}
            <div>
              <h3 className="text-lg font-medium mb-3">Khóa học đang theo học</h3>
              {currentEnrollments.length === 0 ? (
                <div className="text-muted-foreground text-sm">Không có khóa học nào đang theo học</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã môn học</TableHead>
                      <TableHead>Tên môn học</TableHead>
                      <TableHead>Lớp</TableHead>
                      <TableHead>Học kỳ</TableHead>
                      <TableHead>Điểm giữa kỳ</TableHead>
                      <TableHead>Điểm cuối kỳ</TableHead>
                      <TableHead>Tổng kết</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentEnrollments.map((enrollment) => (
                      <TableRow key={enrollment.id}>
                        <TableCell>{enrollment.course?.code}</TableCell>
                        <TableCell>{enrollment.course?.title}</TableCell>
                        <TableCell>{enrollment.class?.code}</TableCell>
                        <TableCell>{enrollment.semester}</TableCell>
                        <TableCell>{enrollment.grade?.midTerm ?? "N/A"}</TableCell>
                        <TableCell>{enrollment.grade?.final ?? "N/A"}</TableCell>
                        <TableCell>{enrollment.grade?.total ?? "N/A"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>

            {/* Past Enrollments */}
            <div>
              <h3 className="text-lg font-medium mb-3">Lịch sử khóa học</h3>
              {pastEnrollments.length === 0 ? (
                <div className="text-muted-foreground text-sm">Không có lịch sử khóa học</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã môn học</TableHead>
                      <TableHead>Tên môn học</TableHead>
                      <TableHead>Học kỳ</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Điểm cuối cùng</TableHead>
                      <TableHead>Xếp loại</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pastEnrollments.map((enrollment) => (
                      <TableRow key={enrollment.id}>
                        <TableCell>{enrollment.course?.code}</TableCell>
                        <TableCell>{enrollment.course?.title}</TableCell>
                        <TableCell>{enrollment.semester}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(enrollment.status)}>
                            {getStatusDisplay(enrollment.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>{enrollment.grade?.total ?? "N/A"}</TableCell>
                        <TableCell>{enrollment.grade?.letterGrade ?? "N/A"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>

            <div className="flex justify-end">
              <Button asChild variant="outline">
                <a href={`/enrollment?student=${student.studentId}`}>
                  Quản lý đăng ký khóa học
                </a>
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default EnrollmentTab;