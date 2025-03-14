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
