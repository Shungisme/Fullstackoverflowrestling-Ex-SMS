import { useStudentContext } from "@/src/context/StudentContext";
import { Student } from "@/src/types";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@repo/ui";
import React, { useState } from "react";
import StudentListTab from "./StudentListTab";
import AddStudentTab from "./AddStudentTab";
import EditStudentTab from "./EditStudentTab";
import DashboardTab from "./DashboardTab";

const StudentManagementTabs = () => {
  const [currentTab, setCurrentTab] = useState("list");
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const {
    students,
    isLoading,
    addStudent,
    updateStudent,
    deleteStudent,
    searchStudents
  } = useStudentContext();

  const handleEditStudent = (studentId: string): void => {
    const student = students.students.find((s) => s.studentId === studentId);
    if (student) {
      setEditingStudent(student);
      setCurrentTab("edit");
    }
  };

  return (
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
        <StudentListTab 
          students={students}
          isLoading={isLoading}
          onSearch={searchStudents}
          onEdit={handleEditStudent}
          onDelete={deleteStudent}
          onAddClick={() => setCurrentTab("add")}
        />
      </TabsContent>

      <TabsContent value="add" className="mt-0">
        <div className="mx-auto max-w-2xl">
          <AddStudentTab 
            onSubmit={(student) => {
              addStudent(student).then(success => {
                  if (success) {
                      setCurrentTab("list")
                  }
              });
              return Promise.resolve(true)
            }} 
          />
        </div>
      </TabsContent>

      <TabsContent value="edit" className="mt-0">
        {editingStudent && (
          <div className="mx-auto max-w-2xl">
            <EditStudentTab
              student={editingStudent}
              onSubmit={async (student) => {
                return updateStudent(student).then(() => {
                      setEditingStudent(null);
                      setCurrentTab("list");
                  });
              }}
              onCancel={() => {
                setEditingStudent(null);
                setCurrentTab("list");
              }}
            />
          </div>
        )}
      </TabsContent>

      <TabsContent value="dashboard" className="mt-0">
        <DashboardTab students={students.students} />
      </TabsContent>
    </Tabs>
  )
};

export default StudentManagementTabs;
