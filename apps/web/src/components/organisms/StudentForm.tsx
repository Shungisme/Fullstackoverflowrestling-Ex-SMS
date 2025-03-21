"use client";

import { Address, FormErrors, Student } from "@/src/types";
import React, { Children, Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";
import { validateEmail, validatePhone } from "validations";
import { Card, CardContent, CardHeader, CardTitle } from "../atoms/Card";
import { Button } from "../atoms/Button";
import { ArrowLeft, ArrowLeftCircle } from "lucide-react";
import { Input, Label } from "@repo/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../atoms/Select";
import { Checkbox } from "../atoms/Checkbox";
import AddressForm from "../molecules/AddressForm";

interface StudentFormProps {
  isEditForm?: boolean;
  student?: Student;
  onSubmit: (student: Student) => Promise<boolean>;
  onCancel: () => void;
}

const studentInitValue: Student = {
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
    number: "",
    street: "",
    district: "",
    city: "",
    country: "",
  },
};

export default function StudentForm({
  isEditForm = false,
  student = studentInitValue,
  onSubmit,
  onCancel,
}: StudentFormProps) {
  const [formData, setFormData] = useState<Student>({
    ...student,
    dateOfBirth:
      student.dateOfBirth ??
      new Date(student.dateOfBirth).toISOString().split("T")[0],
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "course") setFormData({ ...formData, [name]: Number(value) });
    else setFormData({ ...formData, [name]: value });
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

  const matchMailingWithPermanentAddress = () => {
    setFormData({
      ...formData,
      mailingAddress: { ...formData.permanentAddress! },
    });
  };

  const handleAddressChange = (
    type: "permanentAddress" | "temporaryAddress" | "mailingAddress",
    field: keyof Address,
    value: string,
  ) => {
    setFormData({
      ...formData,
      [type]: {
        ...formData[type],
        [field]: value,
      },
    });
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // StudentID is not editable in this form, so we don't validate it
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
        onSubmit(formData);
      } catch {
        toast.error("Gap loi khi cap nhat sinh vien");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="mr-2 h-8 w-8 p-0 lg:hidden"
          onClick={onCancel}
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <div>
          <h1>
            {isEditForm ? "Sửa thông tin sinh viên" : "Thêm Sinh viên mới"}
          </h1>
          <p>
            {isEditForm
              ? `Cập nhật thông tin của sinh viên ${formData.name}`
              : "Nhập thông tin sinh viên mới vào hệ thống"}
          </p>
        </div>
      </div>
      <div className="space-y-4">
        <BasicInfoSection
          name={formData.name}
          studentId={formData.studentId}
          dateOfBirth={formData.dateOfBirth}
          gender={formData.gender}
          nationality={formData.nationality}
          email={formData.email}
          phone={formData.phone}
          errors={errors}
          handleChange={handleChange}
          handleSelectChange={handleSelectChange}
        />

        <AddressSection
          matchMailingWithPermanentAddress={matchMailingWithPermanentAddress}
          errors={errors}
          permanentAddress={formData.permanentAddress}
          mailingAddress={formData.mailingAddress}
          handleAddressChange={handleAddressChange}
          temporaryAddress={formData.temporaryAddress}
        />
      </div>
    </form>
  );
}

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
}
function FormSection({ title, children }: FormSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6 pt-4">{children}</div>
      </CardContent>
    </Card>
  );
}

function BasicInfoSection({
  studentId,
  name,
  dateOfBirth,
  gender,
  nationality,
  email,
  phone,
  errors,
  handleChange,
  handleSelectChange,
}: {
  studentId: string;
  name: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  email: string | undefined;
  phone: string;
  errors: FormErrors;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
}) {
  return (
    <FormSection title="Basic Info">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="studentId">
            MSSV <span className="text-destructive">*</span>
          </Label>
          <Input
            id="studentId"
            name="studentId"
            value={studentId}
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
            value={name}
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
            value={dateOfBirth}
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
          <Select
            name="gender"
            value={gender}
            onValueChange={(value) => handleSelectChange("gender", value)}
          >
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
          <Label htmlFor="nationality">
            Quốc tịch <span className="text-destructive">*</span>
          </Label>
          <Input
            id="nationality"
            name="nationality"
            value={nationality}
            onChange={handleChange}
            placeholder="Nhập quốc tịch"
            className={errors.nationality ? "border-destructive" : ""}
          />
          {errors.nationality && (
            <p className="text-xs text-destructive">{errors.nationality}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={email}
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
            value={phone}
            onChange={handleChange}
            placeholder="Nhập số điện thoại"
            className={errors.phone ? "border-destructive" : ""}
          />
          {errors.phone && (
            <p className="text-xs text-destructive">{errors.phone}</p>
          )}
        </div>
      </div>
    </FormSection>
  );
}

function AddressSection({
  matchMailingWithPermanentAddress,
  permanentAddress,
  errors,
  temporaryAddress,
  mailingAddress,
  handleAddressChange,
}: {
  matchMailingWithPermanentAddress: () => void;
  permanentAddress: Address | undefined;
  errors: FormErrors;
  temporaryAddress: Address | undefined;
  mailingAddress: Address;
  handleAddressChange: (
    type: "permanentAddress" | "temporaryAddress" | "mailingAddress",
    field: keyof Address,
    value: string,
  ) => void;
}) {
  const [useTemporaryAddress, setUseTemporaryAddress] =
    useState<boolean>(false);
  const [sameAsPermanent, setSameAsPermanent] = useState<boolean>(true);

  const toggleSameAsPermanent = () => {
    setSameAsPermanent(!sameAsPermanent);
    if (!sameAsPermanent) {
      matchMailingWithPermanentAddress();
    }
  };

  return (
    <FormSection title="Address">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Địa chỉ thường trú</h3>
          <AddressForm
            address={permanentAddress!}
            onChange={(field: keyof Address, value: string) =>
              handleAddressChange("permanentAddress", field, value)
            }
            errors={errors}
            errorKey="permanentAddress"
          />
        </div>

        <div className="flex items-center space-x-2 pt-4">
          <Checkbox
            id="useTemporaryAddress"
            checked={useTemporaryAddress}
            onCheckedChange={(checked) =>
              setUseTemporaryAddress(checked === true)
            }
          />
          <label
            htmlFor="useTemporaryAddress"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Sử dụng địa chỉ tạm trú
          </label>
        </div>

        {useTemporaryAddress && (
          <div className="pt-4">
            <h3 className="text-lg font-medium mb-4">Địa chỉ tạm trú</h3>
            <AddressForm
              address={temporaryAddress!}
              onChange={(field: keyof Address, value: string) =>
                handleAddressChange("temporaryAddress", field, value)
              }
              errors={errors}
              errorKey="temporaryAddress"
            />
          </div>
        )}

        <div className="pt-4">
          <div className="flex items-center space-x-2 mb-4">
            <Checkbox
              id="sameAsPermanent"
              checked={sameAsPermanent}
              onCheckedChange={toggleSameAsPermanent}
            />
            <label
              htmlFor="sameAsPermanent"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Địa chỉ nhận thư giống địa chỉ thường trú
            </label>
          </div>

          {!sameAsPermanent && (
            <>
              <h3 className="text-lg font-medium mb-4">Địa chỉ nhận thư</h3>
              <AddressForm
                address={mailingAddress!}
                onChange={(field: keyof Address, value: string) =>
                  handleAddressChange("mailingAddress", field, value)
                }
                errors={errors}
                errorKey="mailingAddress"
              />
            </>
          )}
        </div>
      </div>
    </FormSection>
  );
}
