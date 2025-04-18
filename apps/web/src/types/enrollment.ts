import { IAPIResponse, Student } from ".";
import { PaginatedResponse } from "../lib/api/school-service";
import { Class } from "./course";

export enum EnrollmentStatus {
  DROP = "DROP",
  COMPLETE = "COMPLETE",
  FAIL = "FAIL",
}

export interface Enrollment {
  id?: string;
  studentId: string;
  student?: Student;
  classCode: string;
  class?: Class;
  createdAt: string;
  type: EnrollmentStatus;
}

export interface EnrollmentFormData {
  studentId: string;
  courseId: string;
  classCode: string;
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

export interface EnrollmentResponse
  extends IAPIResponse<PaginatedResponse<Enrollment>> {}
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
