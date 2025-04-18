import { Button } from "@/src/components/atoms/Button";
import { Input, Label } from "@repo/ui";
import React, { useState } from "react";
import { toast } from "sonner";

interface ResultsSearchProps {
  initialStudentId?: string;
  initialClassCode?: string;
  onSubmit: (studentId?: string, classCode?: string) => void;
}

const ResultsSearch: React.FC<ResultsSearchProps> = ({
  initialStudentId = "",
  initialClassCode = "",
  onSubmit,
}) => {
  const [studentId, setStudentId] = useState<string>(initialStudentId);
  const [classCode, setClassCode] = useState<string>(initialClassCode);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (studentId.trim() === "" && classCode.trim() === "") {
      toast.error("Vui lòng nhập mã sinh viên hoặc mã lớp học");
      return;
    }

    onSubmit(studentId, classCode);
  };

  const handleClear = () => {
    setStudentId("");
    setClassCode("");
    onSubmit("", "");
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <h2 className="text-lg font-semibold mb-3">Tìm kiếm kết quả sinh viên</h2>

      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Label
            htmlFor="studentId"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Mã số sinh viên
          </Label>
          <Input
            id="studentId"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="Nhập mã số sinh viên"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="flex-1">
          <Label
            htmlFor="classCode"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Mã lớp học
          </Label>
          <Input
            id="classCode"
            value={classCode}
            onChange={(e) => setClassCode(e.target.value)}
            placeholder="Nhập mã lớp học"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="flex items-end space-x-2">
          <Button type="submit" variant="default">
            Tìm kiếm
          </Button>
          <Button type="button" onClick={handleClear} variant="secondary">
            Xóa
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ResultsSearch;
