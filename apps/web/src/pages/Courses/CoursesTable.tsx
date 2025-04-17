"use client";

import { Button } from "@/src/components/atoms/Button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/src/components/atoms/DropDownMenu";
import LoadingSpinner from "@/src/components/LoadingSpinner";
import { DataTable } from "@/src/components/molecules/DataTable";

import { Course } from "@/src/types/course";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, MoreHorizontal, Plus, Trash2 } from "lucide-react";
import React from "react";

type CoursesTableProps = {
    data: Course[];
    isLoading: boolean;
};

const columns: ColumnDef<Course>[] = [
    {
        accessorKey: "code",
        header: "Mã môn học",
    },
    {
        accessorKey: "title",
        header: "Tên môn học",
    },
    {
        accessorKey: "credit",
        header: "Số tín chỉ",
    },
    { accessorKey: "faculty.title", header: "Khoa" },
    {
        accessorKey: "status",
        header: "Trạng thái",
        cell: ({ row }) => {
            const status = row.getValue("status");
            return (
                <span
                    className={`text-${status === "ACTIVATED" ? "green" : "red"}-500`}
                >
                    {status === "ACTIVATED" ? "Đang mở" : "Ngừng hoạt động"}
                </span>
            );
        },
    },
    {
        id: "actions",
        header: "Thao tác",
        cell: ({ row }) => {
            const course = row.original;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="*:cursor-pointer">
                        <DropdownMenuItem asChild>
                            <a href={`/courses/${course.id}/add-class`}>
                                <span className="flex-1">Thêm lớp học</span>
                                <Plus className="mr-2 h-4 w-4" />
                            </a>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <a href={`/courses/${course.id}/edit`}>
                                <span className="flex-1">Chỉnh sửa khóa học</span>
                                <Edit className="mr-2 h-4 w-4" />
                            </a>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-500">
                            <span className="flex-1">Xóa khóa học</span>
                            <Trash2 className="mr-2 h-4 w-4" />
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
const CoursesTable = ({ data, isLoading }: CoursesTableProps) => {
    return (
        <div className="rounded-md border">
            {isLoading ? (
                <LoadingSpinner />
            ) : (
                <DataTable columns={columns} data={data} />
            )}
        </div>
    );
};

export default CoursesTable;
