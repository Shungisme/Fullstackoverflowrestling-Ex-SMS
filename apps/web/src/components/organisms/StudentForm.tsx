import { HTMLInputTypeAttribute, useState } from "react";
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
import {
  Student,
  FormErrors,
  Address,
  Program,
  StudentStatus,
  Faculty,
  IdentityPapers,
} from "../../types";
import { PlusCircle, Loader2, ArrowLeft, Pencil } from "lucide-react";
import { formatDate, parseISO } from "date-fns";
import AddressForm from "../molecules/AddressForm";
import IdentityPaperFormV2 from "../molecules/IdentityPaperFormV2";
import { toast } from "sonner";

interface StudentFormProps {
  programOptions: Program[];
  statusOptions: StudentStatus[];
  facultyOptions: Faculty[];
  onSubmit: (student: Student) => Promise<boolean>;
  onCancel: () => void;
  student?: Student;
}
const initialStudent: Student = {
  studentId: "",
  name: "",
  dateOfBirth: new Date().toISOString(),
  gender: "MALE",
  faculty: {
    title: "",
    description: "",
    status: "",
  },
  course: 0,
  program: {
    title: "",
    description: "",
    status: "",
  },
  email: "",
  phone: "",
  status: {
    title: "",
    description: "",
    status: "",
  },
  nationality: "",
  mailingAddress: {
    country: "",
    district: "",
    street: "",
    number: "",
    city: "",
  },
  identityPaper: {
    type: "CMND",
    number: "",
    issueDate: new Date().toISOString(),
    placeOfIssue: "",
    expirationDate: new Date().toISOString(),
  },
};

export default function StudentForm({
  student,
  onSubmit,
  onCancel,
  facultyOptions,
  statusOptions,
  programOptions,
}: StudentFormProps) {
  let stateStudent = initialStudent;
  if (student) stateStudent = student;
  const [formData, setFormData] = useState<Student>({
    ...stateStudent,
    dateOfBirth: formatDate(stateStudent.dateOfBirth, "yyyy-MM-dd"),
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

  const handleSelectChange = (name: string, value: any) => {
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
    if (!formData.facultyId) newErrors.faculty = "Khoa không được để trống";
    if (!formData.course) newErrors.course = "Khóa không được để trống";
    if (!formData.programId)
      newErrors.program = "Chương trình không được để trống";
    if (!formData.statusId) newErrors.status = "Tình trạng không được để trống";
    if (!formData.nationality)
      newErrors.nationality = "Quốc tịch không được để trống";
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
          setFormData(initialStudent);
        }
      } catch {
        toast.error("");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Card className="border-none shadow-none sm:border sm:shadow-sm">
      <FormHeader
        title={!student ? "Thêm Sinh viên mới" : "Sửa thông tin sinh viên"}
        description={
          !student
            ? "Nhập thông tin sinh viên mới vào hệ thống"
            : `Cập nhật thông tin của sinh viên ${formData.name}`
        }
        onCancel={onCancel}
      />
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              value={formData.studentId}
              name="studentId"
              label="MSSV"
              isRequired={true}
              handleChange={handleChange}
              errors={errors}
              disabled={student !== undefined}
            />
            <InputField
              value={formData.name}
              name="name"
              label="Họ tên"
              isRequired
              handleChange={handleChange}
              errors={errors}
              placeholder="Nhập họ tên"
            />
            <InputField
              value={formData.dateOfBirth}
              name="dateOfBirth"
              type="date"
              label="Ngày sinh"
              isRequired
              handleChange={handleChange}
              errors={errors}
            />

            <SelectInput
              name="gender"
              value={formData.gender}
              placeholder="Giới tính"
              label="Giới tính"
              errors={errors}
              onValueChange={(value) => handleSelectChange("gender", value)}
              data={[
                {
                  id: "MALE",
                  title: "Nam",
                },
                {
                  id: "FEMALE",
                  title: "Nữ",
                },
              ]}
            />

            <SelectInput
              name="faculty"
              value={formData.facultyId ?? formData.faculty.id}
              onValueChange={(value) => handleSelectChange("facultyId", value)}
              placeholder="Chọn khoa"
              label="Khoa"
              errors={errors}
              data={facultyOptions}
            />
            <InputField
              label="Khóa"
              name="course"
              value={formData.course}
              handleChange={handleChange}
              placeholder="Ví dụ: 22"
              errors={errors}
              isRequired
            />

            <SelectInput
              name="program"
              value={formData.programId ?? formData.program.id}
              onValueChange={(value) => handleSelectChange("programId", value)}
              placeholder="Nhập chương trình đào tạo"
              isRequired
              label="Chương trình"
              errors={errors}
              data={programOptions}
            />

            <SelectInput
              name="status"
              value={formData.statusId ?? formData.status.id}
              onValueChange={(value) => handleSelectChange("statusId", value)}
              placeholder="Chọn tình trạng"
              isRequired
              label="Tình trạng"
              errors={errors}
              data={statusOptions}
            />
            <InputField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              handleChange={handleChange}
              placeholder="example@email.com"
              errors={errors}
              isRequired
            />
            <InputField
              name="phone"
              label="Số điện thoại"
              value={formData.phone}
              handleChange={handleChange}
              errors={errors}
              isRequired
              placeholder="Nhập số điện thoại"
            />

            <InputField
              name="nationality"
              label="Quốc tịch"
              value={formData.nationality}
              handleChange={handleChange}
              errors={errors}
              isRequired
              placeholder="Nhập quốc tịch"
            />

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="mailingAddress">
                Địa chỉ nhận thư <span className="text-destructive">*</span>
              </Label>
              <AddressForm
                address={formData.mailingAddress}
                onChange={(field: keyof Address, value: string) => {
                  setFormData({
                    ...formData,
                    mailingAddress: {
                      ...formData.mailingAddress,
                      [field]: value,
                    },
                  });
                }}
                errors={errors}
                errorKey="mailingAddress"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="identityPaper">
                Giấy tờ cá nhân <span className="text-destructive">*</span>
              </Label>
              <IdentityPaperFormV2
                identityPaper={formData.identityPaper}
                onChange={(
                  field: keyof IdentityPapers,
                  value: string | boolean
                ) => {
                  setFormData({
                    ...formData,
                    identityPaper: {
                      ...formData.identityPaper,
                      [field]: value,
                    },
                  });
                }}
                errors={errors}
              />
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
                  {!student ? "Đang thêm..." : "Đang chỉnh sửa"}
                </>
              ) : (
                <>
                  {!student ? (
                    <PlusCircle className="h-4 w-4" />
                  ) : (
                    <Pencil className="w-4 h-4" />
                  )}
                  {!student ? "Thêm Sinh viên" : "Chỉnh sửa"}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function SelectInput({
  errors,
  value,
  label,
  name,
  placeholder,
  data,
  isRequired,
  onValueChange,
}: {
  errors: FormErrors;
  label: string;
  value?: string;
  name: string;
  placeholder: string;
  data: Array<Faculty | StudentStatus | Program | any>;
  isRequired?: boolean;
  onValueChange?: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor="gender">
        {label} {isRequired && <span className="text-destructive">*</span>}
      </Label>
      <Select name={name} value={value} onValueChange={onValueChange}>
        <SelectTrigger className={errors[name] ? "border-destructive" : ""}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {data.map((item) => (
            <SelectItem key={item.id} value={item.id}>
              {item.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {errors[name] && (
        <p className="text-xs text-destructive">{errors[name]}</p>
      )}
    </div>
  );
}

function InputField({
  value,
  type = "text",
  handleChange,
  errors,
  name,
  label,
  isRequired = false,
  placeholder,
  disabled = false,
}: {
  value: string | number;
  type?: HTMLInputTypeAttribute;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: FormErrors;
  name: string;
  label: string;
  isRequired?: boolean;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor="studentId">
        {label} {isRequired && <span className="text-destructive">*</span>}{" "}
      </Label>
      <Input
        disabled={disabled}
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={errors.studentId ? "border-destructive" : ""}
      />
      {errors[name] && (
        <p className="text-xs text-destructive">{errors[name]}</p>
      )}
    </div>
  );
}

function FormHeader({
  title,
  description,
  onCancel,
}: {
  title: string;
  description: string;
  onCancel: () => void;
}) {
  return (
    <CardHeader>
      <div className="flex items-center">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="mr-2 h-8 w-8 p-0 lg:hidden"
          onClick={onCancel}
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Quay về</span>
        </Button>
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </div>
    </CardHeader>
  );
}
