import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/src/components/atoms/Card";
import { Enrollment } from "@/src/types/enrollment";
import { GraduationCap } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/src/components/atoms/Table";
import { Button } from "@/src/components/atoms/Button";
import { Student } from "@/src/types";
import { getStudentEnrollments } from "@/src/lib/api/enrollment-service";

interface EnrollmentTabProps {
    student: Student;
}

//const getStatusBadgeVariant = (status: EnrollmentStatus) => {
//    switch (status) {
//        case EnrollmentStatus.COMPLETE:
//            return "default"; // Adjusted to match allowed values
//        case EnrollmentStatus.DROP:
//            return "destructive";
//        case EnrollmentStatus.FAIL:
//            return "outline";
//        default:
//            return "secondary";
//    }
//};
//
//const getStatusDisplay = (status: EnrollmentStatus) => {
//    switch (status) {
//        case EnrollmentStatus.COMPLETE:
//            return "Đã hoàn thành";
//        case EnrollmentStatus.FAIL:
//            return "Đã hủy";
//        case EnrollmentStatus.DROP:
//            return "Huỷ bỏ";
//        default:
//            return status;
//    }
//};

const EnrollmentTab: React.FC<EnrollmentTabProps> = ({ student }) => {
    if (!student) {
        return <div>Không tìm thấy thông tin sinh viên</div>;
    }
    const [enrollments, setEnrollments] = React.useState<Enrollment[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        async function fetchStudentEnrollments() {
            try {
                const response = await getStudentEnrollments(student.studentId);
                setEnrollments(response.data.data || []);
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
                            <h3 className="text-lg font-medium mb-3">
                                Khóa học đang theo học
                            </h3>
                            {enrollments.length === 0 ? (
                                <div className="text-muted-foreground text-sm">
                                    Không có khóa học nào đang theo học
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Mã lớp</TableHead>
                                            <TableHead>Phòng học</TableHead>
                                            <TableHead>Mã môn</TableHead>
                                            <TableHead>Giảng viên</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {enrollments.map((enrollment) => (
                                            <TableRow key={enrollment.id}>
                                                <TableCell>{enrollment.classCode}</TableCell>
                                                <TableCell>{enrollment.class?.classroom}</TableCell>
                                                <TableCell>{enrollment.class?.subjectCode}</TableCell>
                                                <TableCell>{enrollment.class?.teacher}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </div>

                        {/* Past Enrollments */}
                        <div>
                            <h3 className="text-lg font-medium mb-3">Lịch sử khóa học</h3>
                            <p> Hiện tại chưa được triển khai</p>
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
