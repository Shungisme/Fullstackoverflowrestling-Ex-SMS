import { useState } from "react";
import { Input, Label } from "@repo/ui";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../atoms/Card";
import { Button } from "../atoms/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../atoms/Select";

import { validateEmail, validatePhone } from "validations";
import { Student, FormErrors } from "../../types";
import { PlusCircle, Loader2 } from "lucide-react";
import { parseISO } from "date-fns";
import FacultySelect from "../atoms/FacultySelect";
import StudentStatusSelect from "../atoms/StudentStatusSelect";
import ProgramSelect from "../atoms/ProgramSelect";

interface AddStudentFormProps {
  onSubmit: (student: Student) => Promise<boolean>;
}

export default function AddStudentForm({ onSubmit }: AddStudentFormProps) {
  const [formData, setFormData] = useState<Student>({
    studentId: "",
    name: "",
    dateOfBirth: "",
    gender: "MALE",
    faculty: "",
    course: 0,
    program: "",
    address: "",
    email: "",
    phone: "",
    status: "",
    nationality: "",
    mailingAddress: {
        country: "",
        district: "",
        street: "",
        number: "",
        city: ""
    }
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "course") setFormData({ ...formData, [name]: Number(value) });
    else setFormData({ ...formData, [name]: value });
    // Clear error when field is changed
    if (errors[name]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.studentId.trim())
      newErrors.studentId = "MSSV không được để trống";
    if (!formData.name.trim()) newErrors.name = "Họ tên không được để trống";
    if (!formData.dateOfBirth)
      newErrors.dateOfBirth = "Ngày sinh không được để trống";
    if (!formData.gender) newErrors.gender = "Giới tính không được để trống";
    if (!formData.faculty) newErrors.faculty = "Khoa không được để trống";
    if (!formData.course) newErrors.course = "Khóa không được để trống";
    if (!formData.program.trim())
      newErrors.program = "Chương trình không được để trống";
    if (!formData.address?.trim())
      newErrors.address = "Địa chỉ không được để trống";

    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const dateFormatedForm = {
          ...formData,
          dateOfBirth: parseISO(formData.dateOfBirth).toISOString(),
        };
        const success = await onSubmit(dateFormatedForm);
        if (success) {
          setFormData({
            studentId: "",
            name: "",
            dateOfBirth: "",
            gender: "MALE",
            faculty: "",
            course: 0,
            program: "",
            address: "",
            email: "",
            phone: "",
            status: "Currently Studying",
          });
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Card className="border-none shadow-none sm:border sm:shadow-sm">
      <CardHeader>
        <CardTitle>Thêm Sinh viên mới</CardTitle>
        <CardDescription>
          Nhập thông tin sinh viên mới vào hệ thống
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="studentId">
                MSSV <span className="text-destructive">*</span>
              </Label>
              <Input
                id="studentId"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                placeholder="Nhập MSSV"
                className={errors.studentId ? "border-destructive" : ""}
              />
              {errors.studentId && (
                <p className="text-xs text-destructive">{errors.studentId}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">
                Họ tên <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nhập họ tên"
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">
                Ngày sinh <span className="text-destructive">*</span>
              </Label>
              <Input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className={errors.dateOfBirth ? "border-destructive" : ""}
              />
              {errors.dateOfBirth && (
                <p className="text-xs text-destructive">{errors.dateOfBirth}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">
                Giới tính <span className="text-destructive">*</span>
              </Label>
              <Select name="gender">
                <SelectTrigger
                  className={errors.gender ? "border-destructive" : ""}
                >
                  <SelectValue placeholder="Chọn giới tính" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Nam</SelectItem>
                  <SelectItem value="FEMALE">Nữ</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && (
                <p className="text-xs text-destructive">{errors.gender}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="faculty">
                Khoa <span className="text-destructive">*</span>
              </Label>
              <FacultySelect
                name="faculty"
                value={formData.faculty}
                onValueChange={(value) => handleSelectChange("faculty", value)}
              >
                <SelectTrigger
                  className={errors.faculty ? "border-destructive" : ""}
                >
                  <SelectValue placeholder="Chọn khoa" />
                </SelectTrigger>
              </FacultySelect>
              {errors.faculty && (
                <p className="text-xs text-destructive">{errors.faculty}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="course">
                Khóa <span className="text-destructive">*</span>
              </Label>
              <Input
                id="course"
                name="course"
                value={formData.course}
                onChange={handleChange}
                placeholder="Ví dụ: 22"
                className={errors.course ? "border-destructive" : ""}
              />
              {errors.course && (
                <p className="text-xs text-destructive">{errors.course}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="program">
                Chương trình <span className="text-destructive">*</span>
              </Label>
              <ProgramSelect
                name="program"
                value={formData.program}
                onValueChange={(value) => handleSelectChange("program", value)}
              >
                <SelectTrigger
                  className={errors.program ? "border-destructive" : ""}
                >
                  <SelectValue placeholder="Nhập chương trình đào tạo" />
                </SelectTrigger>
              </ProgramSelect>
              {errors.program && (
                <p className="text-xs text-destructive">{errors.program}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Tình trạng</Label>
              <StudentStatusSelect
                name="status"
                value={formData.status}
                onValueChange={(value) => handleSelectChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn tình trạng" />
                </SelectTrigger>
              </StudentStatusSelect>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@email.com"
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Nhập số điện thoại"
                className={errors.phone ? "border-destructive" : ""}
              />
              {errors.phone && (
                <p className="text-xs text-destructive">{errors.phone}</p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">
                Địa chỉ <span className="text-destructive">*</span>
              </Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Nhập địa chỉ"
                className={errors.address ? "border-destructive" : ""}
              />
              {errors.address && (
                <p className="text-xs text-destructive">{errors.address}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end">
            <Button
              type="submit"
              variant="outline"
              className="flex items-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang thêm...
                </>
              ) : (
                <>
                  <PlusCircle className="h-4 w-4" />
                  Thêm Sinh viên
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
