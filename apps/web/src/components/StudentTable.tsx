import { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Button,
} from "@repo/ui";
import {
  ChevronDown,
  ChevronUp,
  Edit,
  Trash2,
  Eye,
  AlertCircle,
  ChevronLeft,
} from "lucide-react";
import StudentDetails from "./StudentDetails";
import { Student } from "../../types";
import { format } from "date-fns";

interface StudentTableProps {
  students: Student[];
  onEdit: (studentId: string) => void;
  onDelete: (studentId: string) => void;
}

type SortField = "studentId" | "name" | "dateOfBirth" | "faculty" | "course";
type SortDirection = "asc" | "desc";

export default function StudentTable({
  students,
  onEdit,
  onDelete,
}: StudentTableProps) {
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [sortField, setSortField] = useState<SortField>("studentId");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const getStatusClass = (status: string): string => {
    switch (status) {
      case "Currently Studying":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100";
      case "Graduated":
        return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100";
      case "Discontinued":
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100";
      case "Temporarily Suspended":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100";
    }
  };

  const handleViewStudent = (studentId: string): void => {
    const student = students.find((s) => s.studentId === studentId);
    if (student) {
      setViewingStudent(student);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Sort students
  const sortedStudents = [...students].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedStudents.length / rowsPerPage);
  const paginatedStudents = sortedStudents.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <ChevronUp className="ml-1 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-1 h-4 w-4" />
    );
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableCaption>Danh sách sinh viên</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("studentId")}
              >
                <div className="flex items-center">
                  MSSV
                  <SortIcon field="studentId" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center">
                  Họ tên
                  <SortIcon field="name" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("dateOfBirth")}
              >
                <div className="flex items-center">
                  Ngày sinh
                  <SortIcon field="dateOfBirth" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("faculty")}
              >
                <div className="flex items-center">
                  Khoa
                  <SortIcon field="faculty" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("course")}
              >
                <div className="flex items-center">
                  Khóa
                  <SortIcon field="course" />
                </div>
              </TableHead>
              <TableHead>Tình trạng</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <AlertCircle className="h-12 w-12 mb-2" />
                    <h3 className="font-medium text-lg">Không có dữ liệu</h3>
                    <p>Chưa có sinh viên nào trong hệ thống</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedStudents.map((student) => (
                <TableRow key={student.studentId} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    {student.studentId}
                  </TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>
                    {format(new Date(student.dateOfBirth), "dd/mm/yyyy")}
                  </TableCell>
                  <TableCell>{student.faculty}</TableCell>
                  <TableCell>{student.course}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getStatusClass(student.status)}`}
                    >
                      {student.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleViewStudent(student.studentId)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onEdit(student.studentId)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => onDelete(student.studentId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {students.length > 0 && (
        <div className="flex items-center justify-between space-x-2 p-4">
          <div className="text-sm text-muted-foreground">
            Hiển thị {Math.min(rowsPerPage, students.length)} trên{" "}
            {students.length} sinh viên
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
            >
              <ChevronLeft />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (pageNum) => (
                <Button
                  key={pageNum}
                  variant={page === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPage(pageNum)}
                  className="h-8 w-8 p-0"
                >
                  {pageNum}
                </Button>
              ),
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
            >
              Sau
            </Button>
          </div>
        </div>
      )}

      {viewingStudent && (
        <StudentDetails
          student={viewingStudent}
          isOpen={!!viewingStudent}
          onClose={() => setViewingStudent(null)}
          onEdit={onEdit}
        />
      )}
    </>
  );
}
