import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Button,
  Card,
  CardContent,
} from "@repo/ui";
import {
  Edit,
  Mail,
  Phone,
  Home,
  BookOpen,
  User,
  Calendar,
  School,
  Award,
} from "lucide-react";
import { Student } from "../../types";

interface StudentDetailsProps {
  student: Student;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (studentId: string) => void;
}

export default function StudentDetails({
  student,
  isOpen,
  onClose,
  onEdit,
}: StudentDetailsProps) {
  if (!student) return null;

  const formatDate = (dateString: string): string => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  const getStatusClass = (status: string): string => {
    switch (status) {
      case "Đang học":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100";
      case "Đã tốt nghiệp":
        return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100";
      case "Đã thôi học":
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100";
      case "Tạm dừng học":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Đang học":
        return <BookOpen className="h-4 w-4" />;
      case "Đã tốt nghiệp":
        return <Award className="h-4 w-4" />;
      case "Đã thôi học":
        return <User className="h-4 w-4" />;
      case "Tạm dừng học":
        return <User className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div>Thông tin sinh viên</div>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => {
                onClose();
                onEdit(student.studentId);
              }}
            >
              <Edit className="h-4 w-4" /> Sửa
            </Button>
          </DialogTitle>
          <DialogDescription>Chi tiết thông tin sinh viên</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-2">
          <div className="flex flex-col items-center space-y-4">
            <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-12 w-12 text-primary" />
            </div>
            <div className="text-center">
              <h2 className="text-xl font-bold">{student.fullName}</h2>
              <p className="text-sm text-muted-foreground">
                MSSV: {student.studentId}
              </p>
              <div className="mt-2 flex items-center justify-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 ${getStatusClass(
                    student.status
                  )}`}
                >
                  {getStatusIcon(student.status)} {student.status}
                </span>
              </div>
            </div>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Ngày sinh</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(student.dateOfBirth)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Giới tính</p>
                    <p className="text-sm text-muted-foreground">
                      {student.gender}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <School className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Khoa</p>
                    <p className="text-sm text-muted-foreground">
                      {student.faculty}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <BookOpen className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Khóa</p>
                    <p className="text-sm text-muted-foreground">
                      {student.batch}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 md:col-span-2">
                  <Award className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Chương trình</p>
                    <p className="text-sm text-muted-foreground">
                      {student.program}
                    </p>
                  </div>
                </div>

                {student.email && (
                  <div className="flex items-start gap-2">
                    <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">
                        {student.email}
                      </p>
                    </div>
                  </div>
                )}

                {student.phone && (
                  <div className="flex items-start gap-2">
                    <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Số điện thoại</p>
                      <p className="text-sm text-muted-foreground">
                        {student.phone}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-2 md:col-span-2">
                  <Home className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Địa chỉ</p>
                    <p className="text-sm text-muted-foreground">
                      {student.address}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
