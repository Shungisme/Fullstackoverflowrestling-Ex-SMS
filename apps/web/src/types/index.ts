export interface Student {
  studentId: string;
  name: string;
  dateOfBirth: string;
  gender: "MALE" | "FEMALE";
  faculty: string;
  course: number;
  program: string;
  address?: string;
  email?: string;
  phone: string;
  status:
    | "Currently Studying"
    | "Graduated"
    | "Discontinued"
    | "Temporarily Suspended";
}

export interface FormErrors {
  [key: string]: string | undefined;
}

export interface IAPIResponse<T> {
  statusCode: string; // shoud be typed StatusCode with defined status codes, but we go with string right now
  message: string;
  data: T;
}

export type StudentList = {
    students: Student[];
    total: number;
}

export interface StudentDataRespose
  extends IAPIResponse<StudentList> {}
