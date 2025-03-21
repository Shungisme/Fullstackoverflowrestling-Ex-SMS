"use client";

import { useState } from "react";
import { Input } from "@repo/ui";
import { Button } from "@/src/components/atoms/Button";
import { SearchIcon } from "lucide-react";
import StudentTable from "@/src/components/molecules/StudentTable";
import LoadingSpinner from "@/src/components/LoadingSpinner";
import { Student, StudentList } from "@/src/types";

type StudentListTabProps = {
  students: StudentList;
  isLoading: boolean;
  onSearch: (searchTerm: string) => Promise<void>;
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
  onPageChange
}: StudentListTabProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    onSearch(searchTerm);
  };
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
          <Input
            placeholder="Tìm kiếm theo tên hoặc MSSV..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
        </div>
        <Button onClick={onAddClick}>Thêm Sinh viên</Button>
      </div>

      <div className="rounded-md border">
        <StudentTable data={students} onEdit={onEdit} onDelete={onDelete} onPageChange={onPageChange} />
      </div>
    </>
  );
}
