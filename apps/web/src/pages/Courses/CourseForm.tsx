"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useSchoolConfigContext } from "@/src/context/SchoolConfigContext";
import TextareaInputField from "@/src/components/atoms/TextareaInputField";
import { Button } from "@/src/components/atoms/Button";
import { MultiSelectInputField } from "@/src/components/atoms/MultiSelectInputField";
import { toast } from "sonner";
import LoadingSpinner from "@/src/components/LoadingSpinner";
import RequiredStar from "@/src/components/atoms/RequiredStar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/src/components/atoms/Select";

export const formSchema = z.object({
    id: z.string().optional(),
    code: z.string().min(1, { message: "Mã môn học không được để trống" }),
    title: z.string().min(1, { message: "Tên môn học không được để trống" }),
    credit: z.number().min(2, { message: "Số tín chỉ phải lớn hơn 1" }),
    facultyId: z.string().min(1, { message: "Khoa không được để trống" }),
    description: z.string().min(1, { message: "Mô tả không được để trống" }),
    prerequisite: z.array(z.string()).optional(),
});

type CourseFormProps = {
    variant?: "add" | "edit";
    defaultValues?: z.infer<typeof formSchema>;
    onSubmit: (value: z.infer<typeof formSchema>) => Promise<void>;
};

const CourseForm = ({
    variant = "add",
    defaultValues,
    onSubmit,
}: CourseFormProps) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues || {
            code: "",
            title: "",
            credit: 2,
            facultyId: "",
            description: "",
        },
    });

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setIsLoading(true);
            await onSubmit(values);
        } catch (e) {
            toast.error("Something wrong happened! Please try again later!");
        } finally {
            setIsLoading(false);
        }
    };

    const { faculties, courses } = useSchoolConfigContext();
    const coursesList = courses.filter(course => course.code !== defaultValues?.code);
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                            <InputField
                                label="Mã môn học"
                                placeholder="Nhập mã môn học"
                                required
                                disabled={variant === "edit"}
                                description={
                                    variant === "edit" ? "Không thể chỉnh sửa mã môn học" : ""
                                }
                                {...field}
                            />
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <InputField
                                label="Tên môn học"
                                placeholder="Nhập tên môn học"
                                required
                                {...field}
                            />
                        )}
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="credit"
                        render={({ field }) => (
                            <NumberInputField
                                label="Số tín chỉ"
                                placeholder="Nhập số tín chỉ"
                                required
                                {...field}
                            />
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="facultyId"
                        render={({ field }) => (
                            // TODO: Change to seperate component like above. Currenly have 
                            // to do this to fix ref warning because shadcn Select component 
                            // doesn't have ref to forward
                            
                            <FormItem>
                                <FormLabel>Khoa {<RequiredStar />}</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn khoa" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {faculties.map((item) => (
                                            <SelectItem key={item.id} value={item.id!}>
                                                {item.title}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <TextareaInputField
                            label="Mô tả"
                            placeholder="Nhập mô tả"
                            required
                            {...field}
                        />
                    )}
                />
                <FormField
                    control={form.control}
                    name="prerequisite"
                    render={({ field }) => {
                        const { onChange, value, ...rest } = field;
                        return (
                            <MultiSelectInputField
                                label="Môn học tiên quyết"
                                placeholder="Chọn môn học tiên quyết"
                                contents={coursesList.map((course) => ({
                                    value: course.id || "",
                                    displayValue: course.title,
                                }))}
                                onChange={onChange}
                                value={value!}
                                {...rest}
                            />
                        );
                    }}
                />
                <Button type="submit" disabled={isLoading} className="gap-4">
                    {isLoading && <LoadingSpinner />}
                    {variant === "add" ? "Thêm" : "Chỉnh sửa"}
                </Button>
            </form>
        </Form>
    );
};

export default CourseForm;
