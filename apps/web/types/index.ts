export interface Student {
  studentId: string;
  fullName: string;
  dateOfBirth: string;
  gender: "Nam" | "Nữ" | "Khác";
  faculty: string;
  batch: string;
  program: string;
  address: string;
  email: string;
  phone: string;
  status: "Đang học" | "Đã tốt nghiệp" | "Đã thôi học" | "Tạm dừng học";
}

export interface FormErrors {
  [key: string]: string | undefined;
}
