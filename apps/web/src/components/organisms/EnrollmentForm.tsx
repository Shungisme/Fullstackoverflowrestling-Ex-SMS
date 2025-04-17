"use client";

import React, { useEffect, useState, useCallback } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/atoms/Select";
import { Button } from "@/src/components/atoms/Button";
import { toast } from "sonner";
import LoadingSpinner from "@/src/components/LoadingSpinner";
import { useSchoolConfigContext } from "@/src/context/SchoolConfigContext";
import { getStudent } from "@/src/lib/api/student-service";
import { Course, Class } from "@/src/types/course";
import { addEnrollment, checkClassCapacity, checkPrerequisites } from "@/src/lib/api/enrollment-service";
import { Student } from "@/src/types";
import { Alert, AlertDescription, AlertTitle } from "@/src/components/atoms/Alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { CourseService } from "@/src/lib/api/school-service";

const enrollmentFormSchema = z.object({
  studentId: z.string().min(1, { message: "Mã sinh viên không được để trống" }),
  courseId: z.string().min(1, { message: "Khóa học không được để trống" }),
  classId: z.string().min(1, { message: "Lớp học không được để trống" }),
  semester: z.string().min(1, { message: "Học kỳ không được để trống" }),
});

type EnrollmentFormProps = {
  onSuccess?: () => void;
  initialStudentId?: string;
};

export function EnrollmentForm({ onSuccess, initialStudentId }: EnrollmentFormProps) {
  const { semesters } = useSchoolConfigContext();
  const [isLoading, setIsLoading] = useState(false);
  const [studentInfo, setStudentInfo] = useState<Student | null>(null);
  const [studentLoading, setStudentLoading] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [prerequisiteStatus, setPrerequisiteStatus] = useState<{valid: boolean, message?: string} | null>(null);
  const [capacityStatus, setCapacityStatus] = useState<{available: boolean, currentCount: number, maxCount: number} | null>(null);

  const form = useForm<z.infer<typeof enrollmentFormSchema>>({
    resolver: zodResolver(enrollmentFormSchema),
    defaultValues: {
      studentId: initialStudentId || "",
      courseId: "",
      classId: "",
      semester: "",
    },
  });

  const selectedStudentId = form.watch("studentId");
  const selectedCourseId = form.watch("courseId");
  const selectedClassId = form.watch("classId");

  const [debouncedStudentId, setDebouncedStudentId] = useState(initialStudentId || "");
  
  // Create a debounce function for student ID input
  const debounceStudentId = useCallback(
    (value: string) => {
      const timer = setTimeout(() => {
        setDebouncedStudentId(value);
      }, 500); // 500ms debounce delay
      
      return () => {
        clearTimeout(timer);
      };
    },
    []
  );
  
  // Watch for student ID changes and apply debounce
  useEffect(() => {
    if (initialStudentId) return; // Skip if initialStudentId is provided
    const cleanupFn = debounceStudentId(selectedStudentId);
    return cleanupFn;
  }, [selectedStudentId, debounceStudentId, initialStudentId]);

  // Fetch student info when studentId changes
  useEffect(() => {
    async function fetchStudentInfo() {
      if (!debouncedStudentId) return;
      
      setStudentLoading(true);
      setStudentInfo(null);
      
      try {
        const response = await getStudent(debouncedStudentId);
        setStudentInfo(response.data);
      } catch (error) {
        toast.error("Không thể tìm thấy sinh viên với mã này");
        form.setError("studentId", { message: "Sinh viên không tồn tại" });
      } finally {
        setStudentLoading(false);
      }
    }

    fetchStudentInfo();
  }, [debouncedStudentId, form]);

  // Fetch courses
  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await CourseService.getAll();
        setCourses(response.data.data);
      } catch (error) {
        toast.error("Không thể tải danh sách môn học");
      }
    }

    fetchCourses();
  }, []);

  // Fetch classes when course changes
  useEffect(() => {
    async function fetchClasses() {
      if (!selectedCourseId) {
        setClasses([]);
        return;
      }
      
      try {
        // In a real implementation, this would be replaced with an actual API call to get classes for the course
        // For now, creating mock classes
        const mockClasses: Class[] = [
          {
            id: "class1",
            code: "CS101.1",
            subjectCourse: "Introduction to Computer Science",
            semester: "2023-2024 - HK1",
            maximumQuantity: 30,
            classroom: "A101",
            classSchedule: "Monday 9:00-11:00",
            teacher: "Dr. Smith"
          },
          {
            id: "class2",
            code: "CS101.2",
            subjectCourse: "Introduction to Computer Science",
            semester: "2023-2024 - HK1",
            maximumQuantity: 30,
            classroom: "A102",
            classSchedule: "Tuesday 13:00-15:00",
            teacher: "Dr. Johnson"
          }
        ];
        
        setClasses(mockClasses);
      } catch (error) {
        toast.error("Không thể tải danh sách lớp học");
      }
    }

    fetchClasses();
  }, [selectedCourseId]);

  // Check prerequisites when course and student change
  useEffect(() => {
    async function checkCoursePrerequisites() {
      if (!selectedCourseId || !debouncedStudentId) {
        setPrerequisiteStatus(null);
        return;
      }
      
      try {
        const response = await checkPrerequisites(debouncedStudentId, selectedCourseId);
        setPrerequisiteStatus(response.data);
      } catch (error) {
        setPrerequisiteStatus({ valid: false, message: "Không thể kiểm tra môn tiên quyết" });
      }
    }

    checkCoursePrerequisites();
  }, [selectedCourseId, debouncedStudentId]);

  // Check class capacity when class changes
  useEffect(() => {
    async function checkAvailableCapacity() {
      if (!selectedClassId) {
        setCapacityStatus(null);
        return;
      }
      
      try {
        const response = await checkClassCapacity(selectedClassId);
        setCapacityStatus(response.data);
      } catch (error) {
        setCapacityStatus({ available: false, currentCount: 0, maxCount: 0 });
      }
    }

    checkAvailableCapacity();
  }, [selectedClassId]);

  const onSubmit = async (values: z.infer<typeof enrollmentFormSchema>) => {
    if (!prerequisiteStatus?.valid) {
      toast.error("Sinh viên chưa đáp ứng điều kiện tiên quyết cho khóa học này");
      return;
    }
    
    if (!capacityStatus?.available) {
      toast.error("Lớp học đã đầy");
      return;
    }
    
    setIsLoading(true);
    
    try {
      await addEnrollment(values);
      toast.success("Đăng ký khóa học thành công");
      form.reset();
      setPrerequisiteStatus(null);
      setCapacityStatus(null);
      if (onSuccess) onSuccess();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Có lỗi xảy ra khi đăng ký khóa học");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="studentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mã sinh viên</FormLabel>
                <FormControl>
                  <div>
                    <div className="flex">
                      <input
                        disabled={!!initialStudentId || studentLoading}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Nhập mã sinh viên"
                        {...field}
                      />
                    </div>
                    {studentInfo && (
                      <div className="mt-2 text-sm">
                        <p>Họ tên: <span className="font-medium">{studentInfo.name}</span></p>
                        <p>Khoa: <span className="font-medium">{studentInfo.faculty.title}</span></p>
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="semester"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Học kỳ</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={!studentInfo}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn học kỳ" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {semesters?.map((semester) => (
                      <SelectItem
                        key={semester.id}
                        value={semester.id!}
                      >{`${semester.academicYear} - Học kỳ ${semester.semester}`}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="courseId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Môn học</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    // Reset classId when course changes
                    form.setValue("classId", "");
                  }}
                  value={field.value}
                  disabled={!studentInfo}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn môn học" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem
                        key={course.id}
                        value={course.id!}
                      >
                        {course.code} - {course.title}
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
            name="classId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lớp học</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={!selectedCourseId || classes.length === 0}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn lớp học" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {classes.map((classItem) => (
                      <SelectItem
                        key={classItem.id}
                        value={classItem.id!}
                      >
                        {classItem.code} - {classItem.teacher} ({classItem.classSchedule})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {prerequisiteStatus && (
          <Alert variant={prerequisiteStatus.valid ? "default" : "destructive"}>
            {prerequisiteStatus.valid ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>Môn tiên quyết</AlertTitle>
                <AlertDescription>
                  Sinh viên đáp ứng đầy đủ các môn tiên quyết
                </AlertDescription>
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Môn tiên quyết</AlertTitle>
                <AlertDescription>{prerequisiteStatus.message || "Sinh viên chưa đáp ứng các môn tiên quyết"}</AlertDescription>
              </>
            )}
          </Alert>
        )}

        {capacityStatus && (
          <Alert variant={capacityStatus.available ? "default" : "destructive"}>
            {capacityStatus.available ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>Số lượng</AlertTitle>
                <AlertDescription>
                  Lớp học còn {capacityStatus.maxCount - capacityStatus.currentCount} chỗ trống
                </AlertDescription>
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Số lượng</AlertTitle>
                <AlertDescription>
                  Lớp học đã đầy ({capacityStatus.currentCount}/{capacityStatus.maxCount})
                </AlertDescription>
              </>
            )}
          </Alert>
        )}

        <Button 
          type="submit" 
          disabled={isLoading || !studentInfo || !prerequisiteStatus?.valid || !capacityStatus?.available}
          className="w-full"
        >
          {isLoading ? <LoadingSpinner /> : "Đăng ký khóa học"}
        </Button>
      </form>
    </Form>
  );
}