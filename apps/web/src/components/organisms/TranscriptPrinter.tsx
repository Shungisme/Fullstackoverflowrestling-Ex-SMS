"use client";

import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/atoms/Form";
import { Button } from "@/src/components/atoms/Button";
import { toast } from "sonner";
import LoadingSpinner from "@/src/components/LoadingSpinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/atoms/Select";
import { getTranscriptForStudent } from "@/src/lib/api/enrollment-service";
import { useSchoolConfigContext } from "@/src/context/SchoolConfigContext";
import { Card, CardContent } from "@/src/components/atoms/Card";
import { FileText, Printer } from "lucide-react";
import { Student } from "@/src/types";
import { useLanguage } from "@/src/context/LanguageContext";
import { StudentService } from "@/src/lib/api/student-service";
import { getErrorMessage } from "@/src/utils/helper";

const transcriptSchema = z.object({
  studentId: z.string().min(1, { message: "Vui lòng chọn sinh viên" }),
  semesterId: z.string().optional(),
  includeInProgress: z.boolean(),
});

export function TranscriptPrinter() {
  const [isLoading, setIsLoading] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const { semesters } = useSchoolConfigContext();
  const { language } = useLanguage();
  const studentService = new StudentService(language);

  const form = useForm<z.infer<typeof transcriptSchema>>({
    resolver: zodResolver(transcriptSchema),
    defaultValues: {
      studentId: "",
      semesterId: "",
      includeInProgress: false, // Explicitly set a default value
    },
  });

  React.useEffect(() => {
    const loadStudents = async () => {
      setIsLoadingStudents(true);
      try {
        const response = await studentService.getAll(["page=1", "limit=1000"]);
        setStudents(response.data.data);
      } catch (error) {
        toast.error(getErrorMessage(error));
      } finally {
        setIsLoadingStudents(false);
      }
    };

    loadStudents();
  }, []);

  const onSubmit = async (values: z.infer<typeof transcriptSchema>) => {
    setIsLoading(true);

    try {
      const url = getTranscriptForStudent(values.studentId);

      // Open the PDF in a new tab
      window.open(url, "_blank");

      // Cleanup the URL object after a short delay
      setTimeout(() => URL.revokeObjectURL(url), 100);

      toast.success("Bảng điểm đã được tạo thành công");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-card shadow-sm rounded-lg border">
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="studentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sinh viên</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoading || isLoadingStudents}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              isLoadingStudents
                                ? "Đang tải..."
                                : "Chọn sinh viên"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {students.map((student) => (
                          <SelectItem
                            key={student.studentId}
                            value={student.studentId}
                          >
                            {student.studentId} - {student.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="semesterId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Học kỳ (không bắt buộc)</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Tất cả các học kỳ" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="all">Tất cả các học kỳ</SelectItem>
                        {semesters?.map((semester) => (
                          <SelectItem
                            key={semester.id}
                            value={semester.id ?? ""}
                          >
                            {`${semester.academicYear} - Học kỳ ${semester.semester}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/*              <FormField
                control={form.control}
                name="includeInProgress"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Bao gồm khóa học đang học
                      </FormLabel>
                      <FormMessage />
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isLoading}
                      />
                    </FormControl>
                  </FormItem>
                )}
              /> */}
            </div>

            <div className="flex justify-between items-center pt-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <FileText className="h-4 w-4 mr-2" />
                Bảng điểm sẽ được xuất dưới dạng Excel
              </div>
              <Button type="submit" disabled={isLoading} className="gap-2">
                {isLoading ? (
                  <>
                    <LoadingSpinner className="h-4 w-4" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <Printer className="h-4 w-4" />
                    Tạo bảng điểm
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
