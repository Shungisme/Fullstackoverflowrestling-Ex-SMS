//"use client";
//import { useState, useEffect } from "react";
//import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui";
//import { Input } from "@repo/ui";
//import { Button } from "../components/atoms/Button";
//import { SearchIcon } from "lucide-react";
//import AddStudentForm from "../components/organisms/AddStudentForm";
//import EditStudentForm from "../components/organisms/EditStudentForm";
//import StudentTable from "../components/molecules/StudentTable";
//import ConfirmDialog from "../components/molecules/ConfirmDialog";
//import Dashboard from "../components/pages/Dashboard";
//import { Student } from "../types";
//import { toast } from "sonner";
//import StatsList from "../pages/Home/Stats/StatsList";
//import { BASE_URL } from "../constants/constants";
//import { stripEmptyValues } from "../utils/cleaner";
//import { toQueryString } from "../utils/helper";
//import LoadingSpinner from "../components/LoadingSpinner";
//
//export default function HomePage() {
//  const [students, setStudents] = useState<Student[]>([]);
//
//  const [searchTerm, setSearchTerm] = useState("");
//  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
//  const [currentTab, setCurrentTab] = useState("list");
//  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
//  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);
//  const [isLoading, setIsLoading] = useState<boolean>(false);
//  useEffect(() => {
//    const fetchData = async () => {
//      try {
//        setIsLoading(true);
//        const res = await fetch(BASE_URL);
//        const data: Student[] = await res.json();
//        setStudents(data);
//      } catch (e) {
//        toast.error("Có lỗi server diễn ra!");
//      } finally {
//        setIsLoading(false);
//      }
//    };
//    fetchData();
//  }, []);
//
//  const handleAddStudent = async (newStudent: Student): Promise<boolean> => {
//    try {
//      const res = await fetch(BASE_URL, {
//        method: "POST",
//        headers: { "Content-Type": "application/json" },
//        body: JSON.stringify(stripEmptyValues(newStudent)),
//      });
//      if (!res.ok) {
//        toast.error("Mã số sinh viên đã tồn tại!");
//        return false;
//      }
//      setStudents([...students, newStudent]);
//      setCurrentTab("list");
//      toast.success("Đã thêm sinh viên mới vào hệ thống");
//      return true;
//    } catch (e) {
//      toast.error("Mã số sinh viên đã tồn tại!");
//      return false;
//    }
//  };
//
//  const handleEditStudent = (studentId: string): void => {
//    const student = students.find((s) => s.studentId === studentId);
//    if (student) {
//      setEditingStudent(student);
//      setCurrentTab("edit");
//    }
//  };
//
//  const handleUpdateStudent = async (
//    updatedStudent: Student
//  ): Promise<void> => {
//    try {
//      const res = await fetch(`${BASE_URL}/${updatedStudent.studentId}`, {
//        method: "PATCH",
//        headers: { "Content-Type": "application/json" },
//        body: JSON.stringify(stripEmptyValues(updatedStudent)),
//      });
//      if (!res.ok) {
//        toast.error("Không thể cập nhật được sinh viên!");
//        return;
//      }
//      setStudents(
//        students.map((student) =>
//          student.studentId === updatedStudent.studentId
//            ? updatedStudent
//            : student
//        )
//      );
//      setEditingStudent(null);
//      setCurrentTab("list");
//      toast.success("Đã cập nhật thông tin sinh viên");
//    } catch (e) {
//      toast.error("Không thể cập nhật được sinh viên!");
//    }
//  };
//
//  const confirmDeleteStudent = (studentId: string): void => {
//    setStudentToDelete(studentId);
//    setDeleteConfirmOpen(true);
//  };
//
//  const handleDeleteStudent = async (): Promise<void> => {
//    if (studentToDelete) {
//      try {
//        const res = await fetch(`${BASE_URL}/${studentToDelete}`, {
//          method: "DELETE",
//          headers: { "Content-Type": "application/json" },
//        });
//        if (!res.ok) {
//          toast.error("Không thể xóa được sinh viên!");
//          return;
//        }
//        setStudents(
//          students.filter((student) => student.studentId !== studentToDelete)
//        );
//        toast.info("Sinh viên đã được xóa khỏi hệ thống");
//        setStudentToDelete(null);
//      } catch (e) {
//        toast.error("Không thể xóa được sinh viên!");
//      }
//      setDeleteConfirmOpen(false);
//    }
//  };
//
//  const handleSearch = async (): Promise<void> => {
//    try {
//      setIsLoading(true);
//      const queryString = toQueryString({
//        key: searchTerm,
//      });
//      const res = await fetch(`${BASE_URL}?${queryString}`, {
//        headers: { "Content-Type": "application/json" },
//      });
//      if (!res.ok) {
//        toast.error("Có lỗi server diễn ra!");
//      }
//      const data: Student[] = await res.json();
//      setStudents(data);
//    } catch (e) {
//      toast.error("Có lỗi server diễn ra!");
//    } finally {
//      setIsLoading(false);
//    }
//  };
//
//  return (
//    <div className="space-y-8">
//      <div>
//        <h1 className="text-3xl font-bold tracking-tight mb-2">
//          Hệ thống Quản lý Sinh viên
//        </h1>
//        <p className="text-muted-foreground">
//          Quản lý và theo dõi sinh viên trong một giao diện đơn giản.
//        </p>
//      </div>
//
//      <StatsList students={students} />
//      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
//        <TabsList className="grid w-full grid-cols-4 mb-6">
//          <TabsTrigger value="list">Danh sách Sinh viên</TabsTrigger>
//          <TabsTrigger value="add">Thêm Sinh viên</TabsTrigger>
//          <TabsTrigger value="edit" disabled={!editingStudent}>
//            Sửa Thông tin
//          </TabsTrigger>
//          <TabsTrigger value="dashboard">Thống kê</TabsTrigger>
//        </TabsList>
//
//        <TabsContent value="list" className="mt-0">
//          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
//            <div className="flex items-center w-full md:w-1/3 gap-4">
//              <Button variant="outline" onClick={handleSearch}>
//                {isLoading ? (
//                  <LoadingSpinner />
//                ) : (
//                  <SearchIcon className="pointer-events-none h-4 w-4 text-muted-foreground" />
//                )}
//              </Button>
//              <Input
//                placeholder="Tìm kiếm theo tên hoặc MSSV..."
//                value={searchTerm}
//                onChange={(e) => setSearchTerm(e.target.value)}
//                onKeyDown={(e) => {
//                  if (e.key === "Enter") handleSearch();
//                }}
//              />
//            </div>
//            <Button onClick={() => setCurrentTab("add")}>Thêm Sinh viên</Button>
//          </div>
//
//          <div className="rounded-md border">
//            <StudentTable
//              students={students}
//              onEdit={handleEditStudent}
//              onDelete={confirmDeleteStudent}
//            />
//          </div>
//        </TabsContent>
//
//        <TabsContent value="add" className="mt-0">
//          <div className="mx-auto max-w-2xl">
//            <AddStudentForm onSubmit={handleAddStudent} />
//          </div>
//        </TabsContent>
//
//        <TabsContent value="edit" className="mt-0">
//          {editingStudent && (
//            <div className="mx-auto max-w-2xl">
//              <EditStudentForm
//                student={editingStudent}
//                onSubmit={handleUpdateStudent}
//                onCancel={() => {
//                  setEditingStudent(null);
//                  setCurrentTab("list");
//                }}
//              />
//            </div>
//          )}
//        </TabsContent>
//
//        <TabsContent value="dashboard" className="mt-0">
//          <Dashboard students={students} />
//        </TabsContent>
//      </Tabs>
//
//      <ConfirmDialog
//        isOpen={deleteConfirmOpen}
//        onClose={() => setDeleteConfirmOpen(false)}
//        onConfirm={handleDeleteStudent}
//        title="Xóa sinh viên"
//        description="Bạn có chắc chắn muốn xóa sinh viên này không? Hành động này không thể hoàn tác."
//        confirmText="Xóa"
//        cancelText="Hủy"
//        variant="destructive"
//      />
//    </div>
//  );
//}

import StudentManagementPage from "../pages/StudentManagement/StudentManagementPage";

export default function HomePage() {
  return <StudentManagementPage />;
}
