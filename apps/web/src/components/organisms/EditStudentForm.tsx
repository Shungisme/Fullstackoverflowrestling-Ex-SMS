import { useState, useEffect } from "react";
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
import { Student, FormErrors, Address } from "../../types";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import AddressForm from "../molecules/AddressForm";
import { Program, StudentStatus, Faculty } from "../../types";
import { formatDate } from "date-fns";

interface EditStudentFormProps {
    student: Student;
    onSubmit: (student: Student) => void;
    onCancel: () => void;
    programOptions: Program[];
    statusOptions: StudentStatus[];
    facultyOptions: Faculty[];
}

export default function EditStudentForm({
    student,
    onSubmit,
    onCancel,
    programOptions,
    statusOptions,
    facultyOptions,
}: EditStudentFormProps) {
    const [formData, setFormData] = useState<Student>({
        ...student,
        dateOfBirth: formatDate(student.dateOfBirth, "yyyy-MM-dd"),
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        // StudentID is not editable in this form, so we don't validate it
        if (!formData.name.trim()) newErrors.name = "Họ tên không được để trống";
        if (!formData.dateOfBirth)
            newErrors.dateOfBirth = "Ngày sinh không được để trống";
        if (!formData.gender) newErrors.gender = "Giới tính không được để trống";
        if (!formData.faculty) newErrors.faculty = "Khoa không được để trống";
        if (!formData.course) newErrors.course = "Khóa không được để trống";
        if (!formData.program.title.trim())
            newErrors.program = "Chương trình không được để trống";
        //if (!formData.address?.trim())
        //    newErrors.address = "Địa chỉ không được để trống";

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
                const newData: Student = {
                    ...formData,
                    facultyId: formData.faculty.id,
                    statusId: formData.status.id,
                    programId: formData.program.id,
                    mailingAddressId: formData.mailingAddress.id,
                    identityPaperId: formData.identityPaper.id,
                };
                onSubmit(newData);
            } catch {
                toast.error("Gap loi khi cap nhat sinh vien");
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <Card className="border-none shadow-none sm:border sm:shadow-sm">
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
                        <span className="sr-only">Back</span>
                    </Button>
                    <div>
                        <CardTitle>Sửa thông tin sinh viên</CardTitle>
                        <CardDescription>
                            Cập nhật thông tin của sinh viên {formData.name}
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="studentId">Mã số sinh viên</Label>
                            <Input
                                id="studentId"
                                name="studentId"
                                value={formData.studentId}
                                disabled
                                className="bg-muted/50"
                            />
                            <p className="text-xs text-muted-foreground">
                                Mã số sinh viên không thể thay đổi
                            </p>
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
                            <Select
                                name="gender"
                                value={formData.gender}
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
                            <Label htmlFor="faculty">
                                Khoa <span className="text-destructive">*</span>
                            </Label>
                            <Select
                                name="faculty"
                                value={formData.faculty.id}
                                onValueChange={(value) =>
                                    handleSelectChange("facultyId", value)
                                }
                            >
                                <SelectTrigger
                                    className={errors.faculty ? "border-destructive" : ""}
                                >
                                    <SelectValue placeholder="Chọn khoa" />
                                </SelectTrigger>
                                <SelectContent>
                                    {facultyOptions.map((item) => (
                                        <SelectItem key={item.id} value={item.id ?? ""}>
                                            {item.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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
                                placeholder="Ví dụ: K45"
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
                            <Select
                                name="program"
                                value={formData.programId ?? formData.program.title}
                                onValueChange={(value) =>
                                    handleSelectChange("programId", value)
                                }
                            >
                                <SelectTrigger
                                    className={errors.program ? "border-destructive" : ""}
                                >
                                    <SelectValue placeholder="Chọn chương trình" />
                                </SelectTrigger>
                                <SelectContent>
                                    {programOptions.map((item) => (
                                        <SelectItem key={item.id} value={item.id ?? ""}>
                                            {item.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.program && (
                                <p className="text-xs text-destructive">{errors.program}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">Tình trạng</Label>
                            <Select
                                name="status"
                                value={formData.statusId}
                                onValueChange={(value) => handleSelectChange("statusId", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn tình trạng" />
                                </SelectTrigger>
                                <SelectContent>
                                    {statusOptions.map((item) => (
                                        <SelectItem key={item.id} value={item.id ?? ""}>
                                            {item.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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
                                errorKey="address"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                            disabled={isSubmitting}
                        >
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            className="flex items-centers"
                            variant="outline"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                                    Đang xử lý...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Lưu thay đổi
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
