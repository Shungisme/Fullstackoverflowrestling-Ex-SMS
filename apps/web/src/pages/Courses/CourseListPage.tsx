"use client";
import { Button } from "@/src/components/atoms/Button";
import SearchBar from "@/src/components/atoms/SearchBar";
import { Plus } from "lucide-react";
import React from "react";
import CoursesTable from "./CoursesTable";
import { Course, CourseStatus } from "@/src/types/course";

const fakeData: Course[] = [
    {
        id: "1",
        code: "CS101",
        title: "Introduction to Computer Science",
        credit: 3,
        faculty: {
            id: "1",
            title: "Computer Science",
            description: "",
            status: "",
        },
        status: CourseStatus.ACTIVE,
        description: "An introduction to the fundamentals of computer science.",
    },
    {
        id: "2",
        code: "MATH101",
        title: "Calculus I",
        credit: 4,
        faculty: { id: "2", title: "Mathematics", description: "", status: "" },
        status: CourseStatus.ACTIVE,
        description:
            "An introduction to calculus, including limits and derivatives.",
    },
];
const CourseListPage = () => {
    return (
        <div className="space-y-4">
            <Button asChild>
                <a href="/courses/new" className="flex items-center">
                    <Plus className="mr-2" />
                    Thêm môn học
                </a>
            </Button>
            <SearchBar onSearch={(value) => console.log(value)} isLoading={false} />
            <CoursesTable data={fakeData} isLoading={false} />
        </div>
    );
};

export default CourseListPage;
