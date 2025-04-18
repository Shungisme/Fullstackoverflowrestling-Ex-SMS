"use client";
import { Button } from "@/src/components/atoms/Button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/src/components/atoms/Form";
import InputField from "@/src/components/atoms/InputField";
import NumberInputField from "@/src/components/atoms/NumberInputField";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/src/components/atoms/Select";
import { useSchoolConfigContext } from "@/src/context/SchoolConfigContext";
import { Course } from "@/src/types/course";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type AddClassFormProps = {
    onSubmit: (value: z.infer<typeof formSchema>) => Promise<void>;
    subjectCourse: Course;
};

const formSchema = z.object({
    code: z.string().min(1, { message: "Mã lớp không được để trống" }),
    courseId: z.string().min(1, { message: "Môn học không được để trống" }),
    semesterId: z.string().min(1, { message: "Học kỳ không được để trống" }),
    maximumQuantity: z
        .number()
        .min(1, { message: "Số lượng tối đa không được để trống" }),
    classroom: z.string().min(1, { message: "Phòng học không được để trống" }),
    classSchedule: z
        .string()
        .min(1, { message: "Thời gian học không được để trống" }),
    teacherName: z.string().min(1, { message: "Giảng viên không được để trống" }),
});

const AddClassForm = ({ onSubmit, subjectCourse }: AddClassFormProps) => {
    if (!subjectCourse) {
        return <div>Không tìm thấy thông tin môn học</div>;
    }
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            code: "",
            courseId: subjectCourse.id!,
            semesterId: "",
            maximumQuantity: 1,
            classroom: "",
            classSchedule: "",
            teacherName: "",
        },
    });

    const { semesters } = useSchoolConfigContext();

    const handleSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            await onSubmit(data);
        } catch (error) {
            toast.error("Error submitting form:" + error);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                            <InputField
                                label="Mã lớp"
                                placeholder="Nhập mã lớp"
                                required
                                {...field}
                            />
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="courseId"
                        render={({ field }) => {
                            const { value, ...rest } = field;
                            return (
                                <InputField
                                    label="Môn học"
                                    value={subjectCourse.title}
                                    disabled
                                    required
                                    {...rest}
                                />
                            );
                        }}
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="semesterId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Học kỳ</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn học kỳ" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {semesters?.map((semester) => (
                                            <SelectItem
                                                key={semester.id}
                                                value={semester.id!}
                                            >{`${semester.academicYear} - Học kỳ ${semester.semester}`}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="maximumQuantity"
                        render={({ field }) => (
                            <NumberInputField
                                label="Số lượng tối đa"
                                placeholder="Nhập số lượng tối đa"
                                required
                                {...field}
                            />
                        )}
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="classroom"
                        render={({ field }) => (
                            <InputField
                                label="Phòng học"
                                placeholder="Nhập phòng học"
                                required
                                {...field}
                            />
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="classSchedule"
                        render={({ field }) => (
                            <InputField
                                label="Lịch học"
                                placeholder="Nhập lịch học"
                                required
                                {...field}
                            />
                        )}
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="teacherName"
                        render={({ field }) => (
                            <InputField
                                label="Giảng viên"
                                placeholder="Nhập giảng viên"
                                required
                                {...field}
                            />
                        )}
                    />
                </div>
                <Button type="submit" className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm lớp học
                </Button>
            </form>
        </Form>
    );
};

export default AddClassForm;
