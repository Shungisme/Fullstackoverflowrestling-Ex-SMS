import { Button } from "@/src/components/atoms/Button";
import { useLanguage } from "@/src/context/LanguageContext";
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

  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (studentId.trim() === "" && classCode.trim() === "") {
      toast.error(t("StudentResults_Search_Error"));
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
      <h2 className="text-lg font-semibold mb-3">
        {t("StudentResults_Search_Title")}
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Label
            htmlFor="studentId"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {t("StudentResults_Search_StudentId")}
          </Label>
          <Input
            id="studentId"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder={t("StudentResults_Search_StudentIdPlaceholder")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="flex-1">
          <Label
            htmlFor="classCode"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {t("StudentResults_Search_ClassCode")}
          </Label>
          <Input
            id="classCode"
            value={classCode}
            onChange={(e) => setClassCode(e.target.value)}
            placeholder={t("StudentResults_Search_ClassCodePlaceholder")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="flex items-end space-x-2">
          <Button type="submit" variant="default">
            {t("StudentResults_Search_SearchBtn")}
          </Button>
          <Button type="button" onClick={handleClear} variant="secondary">
            {t("StudentResults_Search_ClearBtn")}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ResultsSearch;
