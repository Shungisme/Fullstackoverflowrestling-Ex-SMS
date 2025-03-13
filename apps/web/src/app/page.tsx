"use client";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui";
import { Input } from "@repo/ui";
import { Button } from "../components/Button";
import { SearchIcon } from "lucide-react";
import AddStudentForm from "../components/AddStudentForm";
import EditStudentForm from "../components/EditStudentForm";
import StudentTable from "../components/StudentTable";
import ConfirmDialog from "../components/ConfirmDialog";
import Dashboard from "../components/Dashboard";
import { Student } from "../../types";
import { useToast } from "../context/toast-context";
import StatsList from "../pages/Home/Stats/StatsList";

export default function HomePage() {
  const { toast } = useToast();

  const [students, setStudents] = useState<Student[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [currentTab, setCurrentTab] = useState("list");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:3001/student");
        const data: Student[] = await res.json();
        setStudents(data);
      } catch (e) {
        toast({
          title: "Lỗi",
          description: "Co loi server dien ra",
          variant: "destructive",
        });
      }
    };
    fetchData();
    setStudents([]);
  }, []);

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleAddStudent = async (newStudent: Student): Promise<boolean> => {
    try {
      const res = await fetch("http://localhost:3001/student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStudent),
      });
      if (!res.ok) {
        toast({
          title: "Loi",
          description: "Ma so sinh vien da ton tai",
          variant: "destructive",
        });
        return false;
      }
      setStudents([...students, newStudent]);
      setCurrentTab("list");
      toast({
        title: "Thành công",
        description: "Đã thêm sinh viên mới vào hệ thống",
      });
      return true;
    } catch (e) {
      console.log(toast);
      return false;
    }
  };

  const handleEditStudent = (studentId: string): void => {
    const student = students.find((s) => s.studentId === studentId);
    if (student) {
      setEditingStudent(student);
      setCurrentTab("edit");
    }
  };

  const handleUpdateStudent = async (
    updatedStudent: Student,
  ): Promise<void> => {
    try {
      const res = await fetch("http://localhost:3001/student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedStudent),
      });
      if (!res.ok) {
        toast({
          title: "Loi",
          description: "Khong the cap nhat duoc sinh vien",
          variant: "destructive",
        });
      }
      setStudents(
        students.map((student) =>
          student.studentId === updatedStudent.studentId
            ? updatedStudent
            : student,
        ),
      );
      setEditingStudent(null);
      setCurrentTab("list");
      toast({
        title: "Thành công",
        description: "Đã cập nhật thông tin sinh viên",
      });
    } catch (e) {
      console.log(toast);
    }
  };

  const confirmDeleteStudent = (studentId: string): void => {
    setStudentToDelete(studentId);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteStudent = (): void => {
    if (studentToDelete) {
      setStudents(
        students.filter((student) => student.studentId !== studentToDelete),
      );
      toast({
        title: "Đã xóa",
        description: "Sinh viên đã được xóa khỏi hệ thống",
        variant: "destructive",
      });
      setStudentToDelete(null);
    }
    setDeleteConfirmOpen(false);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Hệ thống Quản lý Sinh viên
        </h1>
        <p className="text-muted-foreground">
          Quản lý và theo dõi sinh viên trong một giao diện đơn giản.
        </p>
      </div>

      <StatsList students={students} />
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="list">Danh sách Sinh viên</TabsTrigger>
          <TabsTrigger value="add">Thêm Sinh viên</TabsTrigger>
          <TabsTrigger value="edit" disabled={!editingStudent}>
            Sửa Thông tin
          </TabsTrigger>
          <TabsTrigger value="dashboard">Thống kê</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-0">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="relative w-full md:w-1/3">
              <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên hoặc MSSV..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={() => setCurrentTab("add")} variant="outline">
              Thêm Sinh viên
            </Button>
          </div>

          <div className="rounded-md border">
            <StudentTable
              students={filteredStudents}
              onEdit={handleEditStudent}
              onDelete={confirmDeleteStudent}
            />
          </div>
        </TabsContent>

        <TabsContent value="add" className="mt-0">
          <div className="mx-auto max-w-2xl">
            <AddStudentForm onSubmit={handleAddStudent} />
          </div>
        </TabsContent>

        <TabsContent value="edit" className="mt-0">
          {editingStudent && (
            <div className="mx-auto max-w-2xl">
              <EditStudentForm
                student={editingStudent}
                onSubmit={handleUpdateStudent}
                onCancel={() => {
                  setEditingStudent(null);
                  setCurrentTab("list");
                }}
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="dashboard" className="mt-0">
          <Dashboard students={students} />
        </TabsContent>
      </Tabs>

      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDeleteStudent}
        title="Xóa sinh viên"
        description="Bạn có chắc chắn muốn xóa sinh viên này không? Hành động này không thể hoàn tác."
        confirmText="Xóa"
        cancelText="Hủy"
        variant="destructive"
      />
    </div>
  );
}
