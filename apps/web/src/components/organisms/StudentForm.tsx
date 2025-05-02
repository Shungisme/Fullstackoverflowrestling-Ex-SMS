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
import { useLanguage } from "@/src/context/LanguageContext";

const allowedEmailDomains = ["student.university.edu.vn"];
const allowedPhoneNumber = /^(0|\+84)([3|5|7|8|9])([0-9]{8})$/;

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
  if (student)
    stateStudent = {
      ...student,
      facultyId: student.faculty.id,
      programId: student.program.id,
      statusId: student.status.id,
      mailingAddressId: student.mailingAddress.id,
      identityPaperId: student.identityPaper.id,
    };
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
    const requiredFields = [
      { field: "studentId", message: "MSSV không được để trống" },
      { field: "name", message: "Họ tên không được để trống" },
      { field: "dateOfBirth", message: "Ngày sinh không được để trống" },
      { field: "gender", message: "Giới tính không được để trống" },
      { field: "facultyId", message: "Khoa không được để trống" },
      { field: "course", message: "Khóa không được để trống" },
      { field: "programId", message: "Chương trình không được để trống" },
      { field: "statusId", message: "Tình trạng không được để trống" },
      { field: "nationality", message: "Quốc tịch không được để trống" },
    ];

    requiredFields.forEach(({ field, message }) => {
      if (!formData[field as keyof Student]?.toString().trim()) {
        newErrors[field as keyof Student] = message;
      }
    });

    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = `Email không hợp lệ. Hãy kiểm tra và chắc chắn rằng email của bạn là hợp lệ. Chỉ chấp nhận email của miền trường đại học: ${allowedEmailDomains.join(
        ", ",
      )}`;
    }

    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = `Số điện thoại không hợp lệ. Hãy thử nhập theo định dạng số điện thoại: ${String(allowedPhoneNumber)} `;
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
  const { t } = useLanguage();
  return (
    <Card className="border-none shadow-none sm:border sm:shadow-sm">
      <FormHeader
        title={
          !student
            ? t("StudentForm_FormHeaderTitle_Add")
            : t("StudentForm_FormHeaderTitle_Edit")
        }
        description={
          !student
            ? t("StudentForm_FormHeaderDesc")
            : `${t("StudentForm_FormHeaderTitle_Add")} ${formData.name}`
        }
        onCancel={onCancel}
      />
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              value={formData.studentId}
              name="studentId"
              label={t("StudentForm_StudentId")}
              isRequired={true}
              handleChange={handleChange}
              errors={errors}
              disabled={student !== undefined}
            />
            <InputField
              value={formData.name}
              name="name"
              label={t("StudentForm_StudentName")}
              isRequired
              handleChange={handleChange}
              errors={errors}
              placeholder={t("StudentForm_StudentNamePlaceholder")}
            />
            <InputField
              value={formData.dateOfBirth}
              name="dateOfBirth"
              type="date"
              label={t("StudentForm_DateOfBirth")}
              isRequired
              handleChange={handleChange}
              errors={errors}
            />

            <SelectInput
              name="gender"
              value={formData.gender}
              placeholder={t("StudentForm_GenderPlaceholder")}
              label={t("StudentForm_Gender")}
              errors={errors}
              onValueChange={(value) => handleSelectChange("gender", value)}
              data={[
                {
                  id: "MALE",
                  title: t("StudentForm_Gender_MaleTitle"),
                },
                {
                  id: "FEMALE",
                  title: t("StudentForm_Gender_FemaleTitle"),
                },
              ]}
            />

            <SelectInput
              name="facultyId"
              value={formData.facultyId ?? formData.faculty.id}
              onValueChange={(value) => handleSelectChange("facultyId", value)}
              placeholder={t("StudentForm_FacultyPlaceholder")}
              label={t("StudentForm_Faculty")}
              errors={errors}
              data={facultyOptions}
            />
            <InputField
              label={t("StudentForm_Year")}
              name="course"
              value={formData.course}
              handleChange={handleChange}
              placeholder={t("StudentForm_YearPlaceholder")}
              errors={errors}
              isRequired
            />

            <SelectInput
              name="programId"
              value={formData.programId ?? formData.program.id}
              onValueChange={(value) => handleSelectChange("programId", value)}
              placeholder={t("StudentForm_ProgramPlaceholder")}
              isRequired
              label={t("StudentForm_Program")}
              errors={errors}
              data={programOptions}
            />

            <SelectInput
              name="statusId"
              value={formData.statusId ?? formData.status.id}
              onValueChange={(value) => handleSelectChange("statusId", value)}
              placeholder={t("StudentForm_StatusPlaceholder")}
              isRequired
              label={t("StudentForm_Status")}
              errors={errors}
              data={statusOptions}
            />
            <InputField
              label={t("StudentForm_Email")}
              name="email"
              type="email"
              value={formData.email}
              handleChange={handleChange}
              placeholder={t("StudentForm_EmailPlaceholder")}
              errors={errors}
              isRequired
            />
            <InputField
              name="phone"
              label={t("StudentForm_Phone")}
              value={formData.phone}
              handleChange={handleChange}
              errors={errors}
              isRequired
              placeholder={t("StudentForm_PhonePlaceholder")}
            />

            <InputField
              name="nationality"
              label={t("StudentForm_Nationality")}
              value={formData.nationality}
              handleChange={handleChange}
              errors={errors}
              isRequired
              placeholder={t("StudentForm_NationalityPlaceholder")}
            />

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="mailingAddress">
                {t("StudentForm_MailingAddress")}{" "}
                <span className="text-destructive">*</span>
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
                {t("StudentForm_IdentityPaper")}{" "}
                <span className="text-destructive">*</span>
              </Label>
              <IdentityPaperFormV2
                identityPaper={formData.identityPaper}
                onChange={(
                  field: keyof IdentityPapers,
                  value: string | boolean,
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
                  {!student
                    ? t("StudentForm_SubmitButton_Adding")
                    : t("StudentForm_SubmitButton_Editing")}
                </>
              ) : (
                <>
                  {!student ? (
                    <PlusCircle className="h-4 w-4" />
                  ) : (
                    <Pencil className="w-4 h-4" />
                  )}
                  {!student
                    ? t("StudentForm_SubmitButton_Add")
                    : t("StudentForm_SubmitButton_Edit")}
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
