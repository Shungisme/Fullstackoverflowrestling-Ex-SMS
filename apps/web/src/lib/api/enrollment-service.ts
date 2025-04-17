import { BASE_URL } from "@/src/constants/constants";
import { 
  CancelEnrollmentData, 
  Enrollment, 
  EnrollmentFilter, 
  EnrollmentFormData, 
  EnrollmentResponse, 
  PrintTranscriptParams, 
  SingleEnrollmentResponse 
} from "@/src/types/enrollment";
import { IAPIResponse } from "@/src/types";

export async function getStudentEnrollments(
  studentId: string
): Promise<EnrollmentResponse> {
  try {
    const response = await fetch(
      `${BASE_URL}/enrollments?studentId=${studentId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
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
  data: EnrollmentFormData
): Promise<SingleEnrollmentResponse> {
  try {
    const response = await fetch(`${BASE_URL}/enrollments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Không thể đăng ký khóa học");
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding enrollment:", error);
    throw error;
  }
}

export async function cancelEnrollment(
  enrollmentId: string,
  reason: string
): Promise<SingleEnrollmentResponse> {
  try {
    const response = await fetch(`${BASE_URL}/enrollments/${enrollmentId}/cancel`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reason }),
    });

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
  courseId: string
): Promise<IAPIResponse<{valid: boolean; message?: string}>> {
  try {
    const response = await fetch(`${BASE_URL}/enrollments/check-prerequisites`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ studentId, courseId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        statusCode: response.status,
        message: errorData.message || "Không thể kiểm tra điều kiện tiên quyết",
        data: { valid: false, message: errorData.message }
      };
    }

    return await response.json();
  } catch (error) {
    console.error("Error checking prerequisites:", error);
    return {
      statusCode: 500,
      message: "Lỗi khi kiểm tra điều kiện tiên quyết",
      data: { valid: false, message: "Lỗi khi kiểm tra điều kiện tiên quyết" }
    };
  }
}

export async function checkClassCapacity(
  classId: string
): Promise<IAPIResponse<{available: boolean; currentCount: number; maxCount: number}>> {
  try {
    const response = await fetch(`${BASE_URL}/enrollments/check-capacity/${classId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        statusCode: response.status,
        message: errorData.message || "Không thể kiểm tra số lượng lớp học",
        data: { available: false, currentCount: 0, maxCount: 0 }
      };
    }

    return await response.json();
  } catch (error) {
    console.error("Error checking class capacity:", error);
    return {
      statusCode: 500,
      message: "Lỗi khi kiểm tra số lượng lớp học",
      data: { available: false, currentCount: 0, maxCount: 0 }
    };
  }
}

export async function checkCancellationEligibility(
  enrollmentId: string
): Promise<IAPIResponse<{eligible: boolean; message: string}>> {
  try {
    const response = await fetch(`${BASE_URL}/enrollments/${enrollmentId}/check-cancellation`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        statusCode: response.status,
        message: errorData.message || "Không thể kiểm tra khả năng hủy đăng ký",
        data: { eligible: false, message: errorData.message || "Không thể hủy đăng ký khóa học này" }
      };
    }

    return await response.json();
  } catch (error) {
    console.error("Error checking cancellation eligibility:", error);
    return {
      statusCode: 500,
      message: "Lỗi khi kiểm tra khả năng hủy đăng ký",
      data: { eligible: false, message: "Lỗi khi kiểm tra khả năng hủy đăng ký" }
    };
  }
}

export async function printTranscript(params: PrintTranscriptParams): Promise<Blob> {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append('studentId', params.studentId);
    
    if (params.semesterId) {
      queryParams.append('semesterId', params.semesterId);
    }
    
    const response = await fetch(`${BASE_URL}/enrollments/transcript?${queryParams.toString()}`, {
      method: "GET",
      headers: {
        "Accept": "application/pdf",
      },
    });

    if (!response.ok) {
      throw new Error("Không thể in bảng điểm");
    }

    return await response.blob();
  } catch (error) {
    console.error("Error printing transcript:", error);
    throw error;
  }
}