import { useState, useEffect } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Input,
  Button,
} from "@repo/ui";
import { SearchIcon } from "lucide-react";
import AddStudentForm from "../components/AddStudentForm";
import EditStudentForm from "../components/EditStudentForm";
import StudentTable from "../components/StudentTable";
import { Student } from "../types";

export default function HomePage() {
  const [students, setStudents] = useState<Student[]>(() => {
    if (typeof window !== "undefined") {
      const savedStudents = localStorage.getItem("students");
      return savedStudents ? JSON.parse(savedStudents) : [];
    }
    return [];
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [currentTab, setCurrentTab] = useState("list");

  useEffect(() => {
    localStorage.setItem("students", JSON.stringify(students));
  }, [students]);

  const filteredStudents = students.filter(
    (student) =>
      student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddStudent = (newStudent: Student): boolean => {
    if (
      students.some((student) => student.studentId === newStudent.studentId)
    ) {
      alert("Mã số sinh viên đã tồn tại!");
      return false;
    }
    setStudents([...students, newStudent]);
    setCurrentTab("list");
    return true;
  };

  const handleEditStudent = (studentId: string): void => {
    const student = students.find((s) => s.studentId === studentId);
    if (student) {
      setEditingStudent(student);
      setCurrentTab("edit");
    }
  };

  const handleUpdateStudent = (updatedStudent: Student): void => {
    setStudents(
      students.map((student) =>
        student.studentId === updatedStudent.studentId
          ? updatedStudent
          : student
      )
    );
    setEditingStudent(null);
    setCurrentTab("list");
  };

  const handleDeleteStudent = (studentId: string): void => {
    if (confirm("Bạn có chắc chắn muốn xóa sinh viên này không?")) {
      setStudents(
        students.filter((student) => student.studentId !== studentId)
      );
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Hệ thống Quản lý Sinh viên
      </h1>

      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="list">Danh sách Sinh viên</TabsTrigger>
          <TabsTrigger value="add">Thêm Sinh viên</TabsTrigger>
          <TabsTrigger value="edit" disabled={!editingStudent}>
            Sửa Thông tin
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-6">
          <div className="flex justify-between items-center mb-6">
            <div className="relative w-1/3">
              <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên hoặc MSSV..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={() => setCurrentTab("add")}>Thêm Sinh viên</Button>
          </div>

          <StudentTable
            students={filteredStudents}
            onEdit={handleEditStudent}
            onDelete={handleDeleteStudent}
          />
        </TabsContent>

        <TabsContent value="add" className="mt-6">
          <AddStudentForm onSubmit={handleAddStudent} />
        </TabsContent>

        <TabsContent value="edit" className="mt-6">
          {editingStudent && (
            <EditStudentForm
              student={editingStudent}
              onSubmit={handleUpdateStudent}
              onCancel={() => {
                setEditingStudent(null);
                setCurrentTab("list");
              }}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
