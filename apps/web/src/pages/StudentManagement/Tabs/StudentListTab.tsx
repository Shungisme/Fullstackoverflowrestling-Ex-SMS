"use client";

import { useState } from "react";
import { Input } from "@repo/ui";
import { Button } from "@/src/components/atoms/Button";
import { SearchIcon } from "lucide-react";
import StudentTable from "@/src/components/molecules/StudentTable";
import LoadingSpinner from "@/src/components/LoadingSpinner";
import { Student, StudentList } from "@/src/types";
import { useSchoolConfigContext } from "@/src/context/SchoolConfigContext";
import { StudentSearchParams } from "@/src/types/search";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/src/components/atoms/Select";

type StudentListTabProps = {
    students: StudentList;
    isLoading: boolean;
    onSearch: (searchTerm: StudentSearchParams) => Promise<void>;
    onEdit: (studentId: string) => void;
    onDelete: (studentId: string) => Promise<void>;
    onAddClick: () => void;
    onPageChange: (page: number) => boolean;
};

export default function StudentListTab({
    students,
    isLoading,
    onSearch,
    onEdit,
    onDelete,
    onAddClick,
    onPageChange,
}: StudentListTabProps) {
    const [searchTerm, setSearchTerm] = useState<StudentSearchParams>({
        key: "",
    });
    const { faculties } = useSchoolConfigContext();
    const handleSearch = () => {
        if (searchTerm.faculty === "all") {
            onSearch({ ...searchTerm, faculty: "" });
        } else {
            onSearch(searchTerm);
        }
    };
    if (!students) return <div></div>;
    return (
        <>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div className="flex items-center w-full md:w-1/3 gap-4">
                    <Button variant="outline" onClick={handleSearch}>
                        {isLoading ? (
                            <LoadingSpinner />
                        ) : (
                            <SearchIcon className="pointer-events-none h-4 w-4 text-muted-foreground" />
                        )}
                    </Button>
                    <Select
                        onValueChange={(value) =>
                            setSearchTerm({ ...searchTerm, faculty: value })
                        }
                    >
                        <SelectTrigger className="w-[20rem]">
                            <SelectValue placeholder="Tìm kiếm theo khoa" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả</SelectItem>
                            {faculties.map((faculty) => (
                                <SelectItem key={faculty.id} value={faculty.title}>
                                    {faculty.title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Input
                        placeholder="Tìm kiếm theo tên hoặc MSSV..."
                        value={searchTerm.key}
                        onChange={(e) =>
                            setSearchTerm({
                                ...searchTerm,
                                key: e.target.value,
                            })
                        }
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleSearch();
                        }}
                    />
                </div>
                <Button onClick={onAddClick}>Thêm Sinh viên</Button>
            </div>

            <div className="rounded-md border">
                <StudentTable
                    isLoading={isLoading}
                    data={students}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onPageChange={onPageChange}
                />
            </div>
        </>
    );
}
