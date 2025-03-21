import { useState } from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@repo/ui";
import { Button } from "../atoms/Button";
import {
    ChevronDown,
    ChevronUp,
    Edit,
    Trash2,
    Eye,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    Download,
    FileDown,
    FileSpreadsheet,
} from "lucide-react";
import { toast } from "sonner";
import StudentDetails from "../organisms/StudentDetails";
import { Student, StudentList } from "../../types";
import { format, formatDate } from "date-fns";
import { EngVietFalcutyMap, EngVietStatusMap } from "../../utils/mapper";
import ConfirmDialog from "./ConfirmDialog";
import { useConfirmDialog } from "@/src/hooks/useConfirmDialog";
import { BASE_URL, ListConfig } from "@/src/constants/constants";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../atoms/DropDownMenu";
import FileUploadDialog from "./FileUploadDialog";

interface StudentTableProps {
    data: StudentList;
    onEdit: (studentId: string) => void;
    onDelete: (studentId: string) => Promise<void>;
    onPageChange: (page: number) => boolean;
}

type SortField = "studentId" | "name" | "dateOfBirth" | "faculty" | "course";
type SortDirection = "asc" | "desc";
type ExportType = "json" | "excel";
export default function StudentTable({
    data,
    onEdit,
    onDelete,
    onPageChange,
}: StudentTableProps) {
    const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
    const [sortField, setSortField] = useState<SortField>("studentId");
    const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
    const [page, setPage] = useState(1);
    const [exporting, setExporting] = useState<ExportType | null>(null);
    const rowsPerPage = ListConfig.rowsPerPage;

    const handlePageChange = (page: number) => {
        if (onPageChange(page)) {
            setPage(page);
        }
    };

    const { isOpen, openConfirmDialog, closeConfirmDialog, confirmDelete } =
        useConfirmDialog();

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

    const handleExport = async (type: ExportType) => {
        try {
            setExporting(type);

            const exportUrl = `${BASE_URL}/students/export?type=${type}`; // TODO: will replace by real url later

            window.open(exportUrl, "_blank");
        } catch (error) {
            console.error("Failed to export", error);
            toast.error("Không thể xuất file");
        } finally {
            setTimeout(() => setExporting(null), 1000);
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
    const sortedStudents = [...data.students].sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];

        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
        return 0;
    });

    // Pagination
    const totalPages = Math.ceil(data.total / rowsPerPage);
    const paginatedStudents = sortedStudents;

    const SortIcon = ({ field }: { field: SortField }) => {
        if (sortField !== field) return null;
        return sortDirection === "asc" ? (
            <ChevronUp className="ml-1 h-4 w-4" />
        ) : (
            <ChevronDown className="ml-1 h-4 w-4" />
        );
    };

    const handleImportData = async (file: File) => {
        if (!file) return false;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch(`${BASE_URL}/students/import`, {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                toast.error("File upload failed");
                return false;
            }

            toast.success("File upload successfully");
            return true;
        } catch {
            toast.error("Error uploading file!");
            return false;
        }
    };

    const handleDelete = (studentId: string) => {
        openConfirmDialog(studentId);
    };

    const handleConfirmDelete = async () => {
        await confirmDelete(onDelete);
    };

    if (!data || !Array.isArray(data.students)) return null;
    return (
        <>
            <div className="flex justify-between items-center p-4">
                <h2 className="text-xl font-semibold">Danh sách sinh viên</h2>
                <div className="flex items-center gap-2">
                    <FileUploadDialog onUpload={handleImportData} />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="gap-2">
                                <Download className="h-4 w-4" />
                                {exporting ? "Đang xuất..." : "Xuất dữ liệu"}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={() => handleExport("excel")}
                                disabled={exporting === "excel"}
                                className="cursor-pointer"
                            >
                                <FileDown className="mr-2 h-4 w-4" />
                                <span>
                                    {exporting === "excel" ? "Đang xuất Excel..." : "Xuất ra Excel"}
                                </span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleExport("json")}
                                disabled={exporting === "json"}
                                className="cursor-pointer"
                            >
                                <FileSpreadsheet className="mr-2 h-4 w-4" />
                                <span>
                                    {exporting === "json" ? "Đang xuất Json..." : "Xuất ra Json"}
                                </span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableCaption className="sr-only">Danh sách sinh viên</TableCaption>
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
                        {data.students.length === 0 ? (
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
                                        {formatDate(student.dateOfBirth, "dd/MM/yyyy")}
                                    </TableCell>
                                    <TableCell>{student.faculty.title}</TableCell>
                                    <TableCell>{student.course}</TableCell>
                                    <TableCell>
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs ${getStatusClass(student.status.title)}`}
                                        >
                                            {student.status.title}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="outline" size="icon" asChild>
                                                <Link href={`/students/${student.studentId}`}>
                                                    <Eye className="h-4 w-4" />
                                                </Link>
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
                                                onClick={() => handleDelete(student.studentId)}
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
            {data.students.length > 0 && (
                <div className="flex items-center justify-between space-x-2 p-4">
                    <div className="text-sm text-muted-foreground">
                        Hiển thị {data.students.length} trên {data.total} sinh viên
                    </div>
                    <div className="flex items-center space-x-1">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(Math.max(1, page - 1))}
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
                                    onClick={() => handlePageChange(pageNum)}
                                    className="h-8 w-8 p-0"
                                >
                                    {pageNum}
                                </Button>
                            ),
                        )}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                            disabled={page === totalPages}
                        >
                            <ChevronRight />
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

            <ConfirmDialog
                isOpen={isOpen}
                onClose={closeConfirmDialog}
                onConfirm={handleConfirmDelete}
                title="Xóa sinh viên"
                description="Bạn có chắc chắn muốn xóa sinh viên này không? Hành động này không thể hoàn tác."
                confirmText="Xóa"
                cancelText="Hủy"
                variant="destructive"
            />
        </>
    );
}
