import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui";
import { EnrollmentForm } from "@/src/components/organisms/EnrollmentForm";
import { EnrollmentManagement } from "@/src/components/organisms/EnrollmentManagement";
import { TranscriptPrinter } from "@/src/components/organisms/TranscriptPrinter";
import { getStudent } from "@/src/lib/api/student-service";
import { Student } from "@/src/types";

export default async function EnrollmentPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const studentId = (await searchParams).student as string | undefined;
    // If there's a student ID in URL, open the management tab by default
    const defaultTab = studentId ? "manage" : "enroll";
    if (!studentId) {
        return <div>Không tìm thấy thông tin sinh viên</div>;
    }
    const data = await getStudent(studentId);
    const student = data.data;
    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-8">Quản lý đăng ký khóa học</h1>

            <Tabs defaultValue={defaultTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8">
                    <TabsTrigger value="enroll">Đăng ký khóa học</TabsTrigger>
                    <TabsTrigger value="manage">Quản lý đăng ký</TabsTrigger>
                    <TabsTrigger value="transcript">In bảng điểm</TabsTrigger>
                </TabsList>

                <TabsContent value="enroll" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h2 className="text-xl font-semibold mb-4">
                                Đăng ký khóa học cho sinh viên
                            </h2>
                            <p className="text-muted-foreground mb-6">
                                Hoàn thành mẫu bên cạnh để đăng ký khóa học cho sinh viên. Hệ
                                thống sẽ tự động kiểm tra các điều kiện tiên quyết và số lượng
                                cho phép trong mỗi lớp học.
                            </p>
                            <div className="bg-muted p-4 rounded-md mb-4">
                                <h3 className="font-medium mb-2">Lưu ý khi đăng ký:</h3>
                                <ul className="list-disc list-inside space-y-1 text-sm">
                                    <li>
                                        Sinh viên phải đáp ứng tất cả các điều kiện tiên quyết
                                    </li>
                                    <li>Mỗi lớp học có giới hạn số lượng sinh viên tối đa</li>
                                    <li>
                                        Sinh viên chỉ được đăng ký các khóa học trong cùng học kỳ
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="bg-card shadow-sm rounded-lg border p-6">
                            <EnrollmentForm initialStudentId={student?.studentId || ""} />
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="manage">
                    <EnrollmentManagement studentId={studentId || ""} />
                </TabsContent>

                <TabsContent value="transcript">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h2 className="text-xl font-semibold mb-4">
                                In bảng điểm chính thức
                            </h2>
                            <p className="text-muted-foreground mb-6">
                                Tạo và in bảng điểm chính thức cho sinh viên. Bảng điểm sẽ bao
                                gồm thông tin sinh viên, danh sách môn học, điểm số và điểm
                                trung bình.
                            </p>
                            <div className="bg-muted p-4 rounded-md mb-4">
                                <h3 className="font-medium mb-2">Bảng điểm bao gồm:</h3>
                                <ul className="list-disc list-inside space-y-1 text-sm">
                                    <li>Tiêu đề và thông tin sinh viên</li>
                                    <li>Danh sách môn học và điểm số</li>
                                    <li>Số tín chỉ và điểm trung bình (GPA)</li>
                                    <li>Thông tin học kỳ (nếu chọn cụ thể)</li>
                                </ul>
                            </div>
                        </div>

                        <div>
                            <TranscriptPrinter />
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
