import { useStudentContext } from "@/src/context/StudentContext";
import { Student } from "@/src/types";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@repo/ui";
import React, { useState } from "react";
import StudentListTab from "./StudentListTab";
import AddStudentTab from "./AddStudentTab";
import EditStudentTab from "./EditStudentTab";
import DashboardTab from "./DashboardTab";
import { useLanguage } from "@/src/context/LanguageContext";

const StudentManagementTabs = () => {
  const [currentTab, setCurrentTab] = useState("list");
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const {
    students,
    isLoading,
    addStudent,
    updateStudent,
    deleteStudent,
    searchStudents,
    handlePageChange,
  } = useStudentContext();

  const handleEditStudent = (studentId: string): void => {
    const student = students.students.find((s) => s.studentId === studentId);
    if (student) {
      setEditingStudent(student);
      setCurrentTab("edit");
    }
  };
  const { t } = useLanguage();
  return (
    <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
      <TabsList className="grid w-full grid-cols-4 mb-6">
        <TabsTrigger value="list">{t("tabStudentList")}</TabsTrigger>
        <TabsTrigger value="add">{t("tabAddStudent")}</TabsTrigger>
        <TabsTrigger value="edit" disabled={!editingStudent}>
          {t("tabEditStudent")}
        </TabsTrigger>
        <TabsTrigger value="dashboard">{t("tabStatistics")}</TabsTrigger>
      </TabsList>

      <TabsContent value="list" className="mt-0">
        <StudentListTab
          students={students}
          isLoading={isLoading}
          onSearch={searchStudents}
          onEdit={handleEditStudent}
          onDelete={deleteStudent}
          onAddClick={() => setCurrentTab("add")}
          onPageChange={handlePageChange}
        />
      </TabsContent>

      <TabsContent value="add" className="mt-0">
        <div className="mx-auto max-w-2xl">
          <AddStudentTab
            onCancel={() => setCurrentTab("list")}
            onSubmit={(student) => {
              addStudent(student).then((success) => {
                if (success) {
                  setCurrentTab("list");
                  return true;
                } else {
                  return false;
                }
              });
              return Promise.resolve(false);
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
                const success = await updateStudent(student);
                if (success) {
                  setEditingStudent(null);
                  setCurrentTab("list");
                  return true;
                }
                return false;
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
        <DashboardTab />
      </TabsContent>
    </Tabs>
  );
};

export default StudentManagementTabs;
