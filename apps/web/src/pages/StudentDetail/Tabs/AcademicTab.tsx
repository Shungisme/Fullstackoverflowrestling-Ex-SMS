import { Badge } from "@/src/components/atoms/Badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/atoms/Card";
import { Student } from "@/src/types";
import { TabsContent } from "@repo/ui";
import { BookOpen, School } from "lucide-react";
import React from "react";

interface AcademicTabProps {
  student: Student;
}
const AcademicTab = ({ student }: AcademicTabProps) => {
  return (
    <TabsContent value="academic" className="mt-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Thông tin học vấn</CardTitle>
          <CardDescription>
            Chi tiết về thông tin học vấn của sinh viên
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">Khoa</span>
                <div className="flex items-center gap-2">
                  <School size={18} className="text-primary" />
                  <span className="font-medium">{student?.faculty.title}</span>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">
                  Chương trình
                </span>
                <div className="flex items-center gap-2">
                  <BookOpen size={18} className="text-primary" />
                  <span className="font-medium">{student?.program.title}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">Khóa</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    Năm {student?.course}
                  </Badge>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">
                  Tình trạng
                </span>
                <Badge className="w-fit">{student?.status.title}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default AcademicTab;
