import { BASE_URL } from "@/src/constants/constants";
import {
  EnrollmentFormData,
  EnrollmentResponse,
  EnrollmentStatus,
  PrintTranscriptParams,
  SingleEnrollmentResponse,
} from "@/src/types/enrollment";
import { IAPIResponse } from "@/src/types";
import { ClassService } from "./school-service";
import { ClassResult } from "@/src/types/course";

export async function getStudentEnrollments(
  studentId: string,
): Promise<EnrollmentResponse> {
  try {
    const response = await fetch(
      `${BASE_URL}/student-class-enrolls/student/${studentId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Không thể lấy danh sách khóa học đã đăng ký");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching enrollments:", error);
    throw error;
  }
}

export async function addEnrollment(
  data: EnrollmentFormData,
): Promise<SingleEnrollmentResponse> {
  try {
    const response = await fetch(`${BASE_URL}/student-class-enrolls`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        studentId: data.studentId,
        classCode: data.classCode,
        type: EnrollmentStatus.COMPLETE,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Không thể đăng ký khóa học");
    }

    return await response.json();
  } catch (error) {
    console.log("Error adding enrollment:", error);
    throw error;
  }
}

export async function cancelEnrollment(
  enrollmentId: string,
): Promise<SingleEnrollmentResponse> {
  try {
    const response = await fetch(
      `${BASE_URL}/student-class-enrolls/${enrollmentId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: EnrollmentStatus.DROP,
        }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Không thể hủy đăng ký khóa học");
    }

    return await response.json();
  } catch (error) {
    console.error("Error canceling enrollment:", error);
    throw error;
  }
}

export async function checkPrerequisites(
  studentId: string,
  courseCode: string,
): Promise<IAPIResponse<{ valid: boolean; message?: string }>> {
  // Check by get all the prerequisites of the course and check if the student has passed them
  // by getting all the results of the student and checking if the student has passed the prerequisites
  // This should be done in the backend but for now we will do it in the frontend
  try {
    const classService = new ClassService();
    const res = await classService.getClassResultsOfStudent(
      studentId,
      courseCode,
    );

    if (res.statusCode !== 200 && res.statusCode !== 304) {
      return {
        statusCode: res.statusCode,
        message: res.message,
        data: { valid: false, message: res.message },
      };
    }
    // Asume that the results are calculated by (other * 0.2 + midterm * 0.3 + final * 0.5) / 100
    // and the student passed the course if the result is greater than 5
    // Yes, this should be done in the backend but for now we will do it in the frontend

    const results = res.data;
    // Have to do this because some how the data returned is an object and not an array
    // TODO: Fix this in the backend
    const temp: any = results;
    if (Object.keys(temp).length === 0) {
      return {
        statusCode: 200,
        message: "Đủ điều kiện tiên quyết",
        data: { valid: true },
      };
    }
    if (!results) {
      return {
        statusCode: 200,
        message: "Đủ điều kiện tiên quyết",
        data: { valid: true },
      };
    }

    if (results.length === 0) {
      return {
        statusCode: 400,
        message: "Không có kết quả nào",
        data: { valid: false, message: "Không có kết quả nào" },
      };
    }

    const groupedCourses = results.reduce(
      (acc: { [key: string]: ClassResult[] }, result: ClassResult) => {
        const courseCode = result.class.subjectCode;
        if (!acc[courseCode]) {
          acc[courseCode] = [];
        }
        acc[courseCode].push(result);
        return acc;
      },
      {},
    );
    console.log(groupedCourses);
    const passedCourses = Object.keys(groupedCourses).filter((courseCode) => {
      const courseResults = groupedCourses[courseCode];
      const totalScore = courseResults.reduce((acc, result) => {
        switch (result.type) {
          case "OTHER":
            return acc + result.score * 0.2;
          case "MIDTERM":
            return acc + result.score * 0.3;
          case "FINALTERM":
            return acc + result.score * 0.5;
          default:
            return acc;
        }
      }, 0);
      return totalScore / courseResults.length >= 5;
    });

    const valid = Object.keys(groupedCourses).length === passedCourses.length;
    if (valid) {
      return {
        statusCode: 200,
        message: "Đủ điều kiện tiên quyết",
        data: { valid: true },
      };
    } else {
      return {
        statusCode: 400,
        message: "Không đủ điều kiện tiên quyết",
        data: { valid: false, message: "Không đủ điều kiện tiên quyết" },
      };
    }
  } catch (error) {
    console.log("Error checking prerequisites:", error);
    return {
      statusCode: 500,
      message: "Lỗi khi kiểm tra điều kiện tiên quyết",
      data: { valid: false, message: "Lỗi khi kiểm tra điều kiện tiên quyết" },
    };
  }
}

export async function checkCancellationEligibility(
  enrollmentId: string,
): Promise<IAPIResponse<{ eligible: boolean; message: string }>> {
  try {
    const response = await fetch(
      `${BASE_URL}/enrollments/${enrollmentId}/check-cancellation`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      return {
        statusCode: response.status,
        message: errorData.message || "Không thể kiểm tra khả năng hủy đăng ký",
        data: {
          eligible: false,
          message: errorData.message || "Không thể hủy đăng ký khóa học này",
        },
      };
    }

    return await response.json();
  } catch (error) {
    console.error("Error checking cancellation eligibility:", error);
    return {
      statusCode: 500,
      message: "Lỗi khi kiểm tra khả năng hủy đăng ký",
      data: {
        eligible: false,
        message: "Lỗi khi kiểm tra khả năng hủy đăng ký",
      },
    };
  }
}

export function getTranscriptForStudent(studentId: string) {
    return `${BASE_URL}/students/${studentId}/transcript`;
}
