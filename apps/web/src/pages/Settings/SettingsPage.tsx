import { Card } from "@/src/components/atoms/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui";
import React from "react";
import FacultySettings from "./FacultySettings";
import StudentStatusSettings from "./StudentStatusSettings";
import ProgramSettings from "./ProgramSettings";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Cài đặt Hệ thống</h2>
        <p className="text-muted-foreground mt-2">
          Quản lý các thông tin cấu hình cho hệ thống quản lý sinh viên
        </p>
      </div>

      <Tabs defaultValue="faculties" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="faculties">Khoa</TabsTrigger>
          <TabsTrigger value="statuses">Tình trạng sinh viên</TabsTrigger>
          <TabsTrigger value="programs">Chương trình học</TabsTrigger>
        </TabsList>
        <TabsContent value="faculties">
          <Card className="p-6">
            <FacultySettings />
          </Card>
        </TabsContent>
        <TabsContent value="statuses">
          <Card className="p-6">
            <StudentStatusSettings />
          </Card>
        </TabsContent>
        <TabsContent value="programs">
          <Card className="p-6">
            <ProgramSettings />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
