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
import { useLanguage } from "@/src/context/LanguageContext";

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
    const {language, t} = useLanguage();

    if (!student) {
        return <div>{t("notiNodata")}</div>;
    }
    const [enrollments, setEnrollments] = React.useState<Enrollment[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        async function fetchStudentEnrollments() {
            try {
                const response = await getStudentEnrollments(student.studentId, language);
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
                    {t("EnrollmentTab_Title")}
                </CardTitle>
                <CardDescription>
                    {t("EnrollmentTab_HeaderDesc")} {student.name}
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
                                {t("EnrollmentTab_CurrentEnrollments")}
                            </h3>
                            {enrollments.length === 0 ? (
                                <div className="text-muted-foreground text-sm">
                                    {t("EnrollmentTab_NoEnrollments")}
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>{t("EnrollmentTab_Table_ClassCode")}</TableHead>
                                            <TableHead>{t("EnrollmentTab_Table_Classroom")}</TableHead>
                                            <TableHead>{t("EnrollmentTab_Table_SubjectCode")}</TableHead>
                                            <TableHead>{t("EnrollmentTab_Table_Teacher")}</TableHead>
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
                        {/* <div>
                            <h3 className="text-lg font-medium mb-3">Lịch sử khóa học</h3>
                            <p> Hiện tại chưa được triển khai</p>
                        </div>

                        <div className="flex justify-end">
                            <Button asChild variant="outline">
                                <a href={`/enrollment?student=${student.studentId}`}>
                                    Quản lý đăng ký khóa học
                                </a>
                            </Button>
                        </div> */}
                    </>
                )}
            </CardContent>
        </Card>
    );
};

export default EnrollmentTab;
