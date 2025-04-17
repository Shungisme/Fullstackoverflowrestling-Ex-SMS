import { IAPIResponse, Student } from ".";

export enum EnrollmentStatus {
  PENDING = "pending",
  ACTIVE = "active",
  COMPLETED = "completed",
  CANCELLED = "cancelled"
}

export interface Grade {
  midTerm?: number;
  final?: number;
  other?: number;
  total: number;
  letterGrade?: string;
}

export interface CourseClass {
  id?: string;
  code: string;
  subjectCourse: string;
  semester: string;
  maximumQuantity: number;
  classroom: string;
  classSchedule: string;
  teacher: string;
}

export interface Enrollment {
  id?: string;
  studentId: string;
  student?: {
    id?: string;
    studentId: string;
    name: string;
  };
  courseId: string;
  course?: {
    id?: string;
    code: string;
    title: string;
    credit: number;
    faculty: { id?: string; title: string; description: string; status: string };
    description: string;
    status: string;
  };
  classId: string;
  class?: CourseClass;
  enrollmentDate: string;
  status: EnrollmentStatus;
  semester: string;
  grade?: Grade;
  cancellationDate?: string;
  cancellationReason?: string;
}

export interface EnrollmentFormData {
  studentId: string;
  courseId: string;
  classId: string;
  semester: string;
}

export interface CancelEnrollmentData {
  enrollmentId: string;
  reason: string;
}

export interface EnrollmentFilter {
  studentId?: string;
  courseId?: string;
  semesterId?: string;
  status?: EnrollmentStatus;
}

export interface EnrollmentList {
  enrollments: Enrollment[];
  total: number;
}

export interface PrintTranscriptParams {
  studentId: string;
  semesterId?: string;
}

export interface EnrollmentResponse extends IAPIResponse<Enrollment[]> {}
export interface SingleEnrollmentResponse extends IAPIResponse<Enrollment> {}

export interface PrerequisiteCheckResult {
  valid: boolean;
  message: string;
  missingCourses?: {
    code: string;
    title: string;
  }[];
}

export interface TranscriptOptions {
  studentId: string;
  semester?: string; // Optional - if provided, only prints courses for that semester
  includeInProgress?: boolean;
}