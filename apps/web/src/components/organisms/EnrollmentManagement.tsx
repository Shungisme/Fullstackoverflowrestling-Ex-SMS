"use client";

import React, { useState, useEffect } from "react";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/src/components/atoms/Table";
import { Button } from "@/src/components/atoms/Button";
import { Badge } from "@/src/components/atoms/Badge";
import { 
  Dialog, DialogContent, DialogTitle, 
  DialogHeader
} from "@/src/components/atoms/Dialog";
import { toast } from "sonner";
import LoadingSpinner from "@/src/components/LoadingSpinner";
import { 
  BookOpen, Calendar, CalendarClock, 
  FileDown, Filter, Trash2, User 
} from "lucide-react";
import { Enrollment, EnrollmentFilter, EnrollmentStatus } from "@/src/types/enrollment";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/atoms/Select";
import { getStudentEnrollments } from "@/src/lib/api/enrollment-service";
import { CancelEnrollmentForm } from "./CancelEnrollmentForm";
import { Alert, AlertDescription } from "@/src/components/atoms/Alert";
import { useSchoolConfigContext } from "@/src/context/SchoolConfigContext";
import { formatDate } from "date-fns";

export function EnrollmentManagement({ studentId }: { studentId?: string }) {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<EnrollmentFilter>({ studentId: studentId });
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const { semesters } = useSchoolConfigContext();
  
  // Mock deadline date for demonstration
  const currentDeadlineDate = new Date();
  currentDeadlineDate.setDate(currentDeadlineDate.getDate() + 7); // 7 days from now
  
  useEffect(() => {
    fetchEnrollments();
  }, [filter, studentId]);
  
  const fetchEnrollments = async () => {
    setIsLoading(true);
    try {
      // In this example we're assuming we'll fetch for a specific student,
      // but in a real implementation, you might include more filter criteria
      const response = await getStudentEnrollments(filter.studentId || studentId || "");
      setEnrollments(response.data);
    } catch (error) {
      toast.error("Không thể tải danh sách đăng ký khóa học");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCancelRequest = (enrollment: Enrollment) => {
    setSelectedEnrollment(enrollment);
    setCancelDialogOpen(true);
  };
  
  const handleCancelSuccess = () => {
    setCancelDialogOpen(false);
    fetchEnrollments();
    toast.success("Đã hủy đăng ký khóa học thành công");
  };
  
  const getStatusBadgeVariant = (status: EnrollmentStatus) => {
    switch (status) {
      case EnrollmentStatus.ACTIVE:
        return "default";
      case EnrollmentStatus.COMPLETED:
        return "default"; // Adjust to a valid variant
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
  
  // Check if enrollment can be cancelled
  const isEnrollmentCancellable = (enrollment: Enrollment) => {
    return (
      enrollment.status === EnrollmentStatus.ACTIVE && 
      currentDeadlineDate && 
      new Date() <= currentDeadlineDate
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <h2 className="text-2xl font-bold">Quản lý đăng ký khóa học</h2>
        <div className="flex items-center gap-2">
          <Select
            value={filter.status}
            onValueChange={(value) => 
              setFilter({...filter, status: value as EnrollmentStatus})
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Lọc theo trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={EnrollmentStatus.ACTIVE}>Đang học</SelectItem>
              <SelectItem value={EnrollmentStatus.COMPLETED}>Đã hoàn thành</SelectItem>
              <SelectItem value={EnrollmentStatus.CANCELLED}>Đã hủy</SelectItem>
              <SelectItem value={EnrollmentStatus.PENDING}>Chờ xử lý</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setFilter({})}>Bỏ lọc</Button>
        </div>
      </div>

      {currentDeadlineDate && (
        <Alert>
          <CalendarClock className="h-4 w-4" />
          <AlertDescription>
            Thời hạn hủy đăng ký khóa học: {formatDate(currentDeadlineDate.toISOString(), "dd/MM/yyyy")}
          </AlertDescription>
        </Alert>
      )}

      <div className="border rounded-md">
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <LoadingSpinner />
            <span className="ml-2">Đang tải dữ liệu...</span>
          </div>
        ) : enrollments.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Không có đăng ký khóa học nào</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Hiện chưa có đăng ký khóa học nào. Vui lòng đăng ký khóa học mới hoặc thử thay đổi bộ lọc.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Sinh viên</TableHead>
                <TableHead className="w-[200px]">Môn học</TableHead>
                <TableHead className="w-[150px]">Lớp học</TableHead>
                <TableHead className="w-[120px]">Học kỳ</TableHead>
                <TableHead className="w-[100px]">Ngày đăng ký</TableHead>
                <TableHead className="w-[100px]">Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enrollments.map((enrollment) => (
                <TableRow key={enrollment.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      <div>
                        <div>{enrollment.student?.name}</div>
                        <div className="text-xs text-muted-foreground">{enrollment.studentId}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div>{enrollment.course?.title}</div>
                      <div className="text-xs text-muted-foreground">{enrollment.course?.code}</div>
                    </div>
                  </TableCell>
                  <TableCell>{enrollment.class?.code}</TableCell>
                  <TableCell>{enrollment.semester}</TableCell>
                  <TableCell>{formatDate(enrollment.enrollmentDate, "dd/MM/yyyy")}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(enrollment.status)}>
                      {getStatusDisplay(enrollment.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {isEnrollmentCancellable(enrollment) && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleCancelRequest(enrollment)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Hủy đăng ký khóa học</DialogTitle>
          </DialogHeader>
          {selectedEnrollment && (
            <CancelEnrollmentForm 
              enrollment={selectedEnrollment}
              onSuccess={handleCancelSuccess}
              onCancel={() => setCancelDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}