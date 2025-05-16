"use client";
import React, { useEffect, useState } from "react";
import { ClassResultService } from "@/src/lib/api/school-service";
import { ClassResult } from "@/src/types/course";
import ScoreResultsTable from "./ScoreResultsTable";
import ResultsSearch from "./ResultsSearch";
import LoadingSpinner from "@/src/components/LoadingSpinner";
import { toast } from "sonner";
import { Button } from "@/src/components/atoms/Button";
import { Plus } from "lucide-react";
import AddScoreModal from "./AddScoreModal";
import { useLanguage } from "@/src/context/LanguageContext";

const StudentResultsPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [studentId, setStudentId] = useState<string>("");
  const [classCode, setClassCode] = useState<string>("");
  const [results, setResults] = useState<ClassResult[]>([]);
  const { language } = useLanguage();
  const service = new ClassResultService(language);

  const loadStudentClassResult = async (
    studentId: string,
    classCode: string,
  ) => {
    setIsLoading(true);
    try {
      const response = await service.getStudentClassResult(
        studentId,
        classCode,
      );
      if (response.statusCode === 200) {
        // The API returns a single result object, wrap it in an array for the table
        setResults(
          Array.isArray(response.data) ? response.data : [response.data],
        );
        setStudentId(studentId);
        setClassCode(classCode);
      } else {
        toast.error("Gặp lỗi khi lấy dữ liệu");
      }
    } catch (error) {
      console.log("Error loading student result:", error);
      toast.error("Gặp lỗi khi lấy dữ liệu");
    } finally {
      setIsLoading(false);
    }
  };

  const loadStudentResults = async (studentId: string) => {
    setIsLoading(true);
    try {
      const response = await service.getStudentResults(studentId);
      if (response.statusCode === 200) {
        setResults(response.data.data);
        setStudentId(studentId);
        setClassCode("");
      } else {
        toast.error("Gặp lỗi khi lấy dữ liệu");
      }
    } catch (error) {
      console.log("Error loading student results:", error);
      toast.error("Gặp lỗi khi lấy dữ liệu");
    } finally {
      setIsLoading(false);
    }
  };

  const loadClassResults = async (classCode: string) => {
    setIsLoading(true);
    try {
      const response = await service.getClassResults(classCode);
      if (response.statusCode === 200) {
        setResults(response.data.data);
        setStudentId("");
        setClassCode(classCode);
      } else {
        toast.error("Gặp lỗi khi lấy dữ liệu");
      }
    } catch (error) {
      console.log("Error loading class results:", error);
      toast.error("Gặp lỗi khi lấy dữ liệu");
    } finally {
      setIsLoading(false);
    }
  };

  const handleScoreUpdate = async (
    resultId: string,
    updatedScore: ClassResult,
  ) => {
    try {
      const response = await service.update(resultId, updatedScore);
      if (response.statusCode === 200) {
        toast.success("Cập nhật điểm thành công");

        // Refresh the data based on current view
        if (studentId && classCode) {
          loadStudentClassResult(studentId, classCode);
        } else if (studentId) {
          loadStudentResults(studentId);
        } else if (classCode) {
          loadClassResults(classCode);
        } else {
          loadAllResults();
        }
      } else {
        toast.error("Gặp lỗi khi cập nhật điểm");
      }
    } catch (error) {
      console.log("Error updating score:", error);
      toast.error("Gặp lỗi khi cập nhật điểm");
    }
  };

  const handleAddScore = async (newScore: Omit<ClassResult, "id">) => {
    try {
      setIsLoading(true);
      const response = await service.create(newScore);

      if (response.statusCode === 201) {
        toast.success("Thêm điểm thành công");

        // Refresh the data based on current view
        if (studentId && classCode) {
          loadStudentClassResult(studentId, classCode);
        } else if (studentId) {
          loadStudentResults(studentId);
        } else if (classCode) {
          loadClassResults(classCode);
        } else {
          loadAllResults();
        }
      } else {
        toast.error("Gặp lỗi khi thêm điểm");
      }
    } catch (error) {
      console.log("Error adding score:", error);
      toast.error("Gặp lỗi khi thêm điểm");
    } finally {
      setIsLoading(false);
    }
  };

  const loadAllResults = async () => {
    setIsLoading(true);
    try {
      const response = await service.getAll();
      if (response.statusCode === 200) {
        setResults(response.data.data);
      } else {
        toast.error("Gặp lỗi khi lấy dữ liệu");
      }
    } catch (error) {
      console.log("Error loading all results:", error);
      toast.error("Gặp lỗi khi lấy dữ liệu");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (studentId?: string, classCode?: string) => {
    if (studentId && classCode) {
      loadStudentClassResult(studentId, classCode);
    }
    if (studentId && !classCode) {
      loadStudentResults(studentId);
    }
    if (!studentId && classCode) {
      loadClassResults(classCode);
    }
    if (!studentId && !classCode) {
      loadAllResults();
    }
  };

  useEffect(() => {
    loadAllResults();
  }, []);

  const { t } = useLanguage();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">{t("StudentResults_Title")}</h1>

      <ResultsSearch
        initialStudentId={studentId}
        initialClassCode={classCode}
        onSubmit={handleSearchSubmit}
      />

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div>
          {studentId && classCode ? (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="font-medium">
                {t("StudentResults_ViewResultOfStudentId")}: {studentId}{" "}
                {t("StudentResults_inclass")}: {classCode}
              </p>
            </div>
          ) : studentId ? (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="font-medium">
                {t("StudentResults_ViewResultOfStudentId")}: {studentId}
              </p>
            </div>
          ) : classCode ? (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="font-medium">
                {t("StudentResults_ViewResultOfClassCode")}: {classCode}
              </p>
            </div>
          ) : null}
          <div className="flex justify-end mb-4">
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              {t("StudentResults_AddNewResult")}
            </Button>
          </div>
          <ScoreResultsTable
            results={results}
            onScoreUpdate={handleScoreUpdate}
          />

          {isAddModalOpen && (
            <AddScoreModal
              onClose={() => setIsAddModalOpen(false)}
              onSave={handleAddScore}
              studentIdParam={studentId}
              classCodeParam={classCode}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default StudentResultsPage;
