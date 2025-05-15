import React, { useState, useEffect } from "react";
import { ClassResult } from "@/src/types/course";
import { Input, Label } from "@repo/ui";
import { Button } from "@/src/components/atoms/Button";
import { mapScoreTypeToLabel } from "@/src/utils/mapper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/atoms/Select";
import { ClassService } from "@/src/lib/api/school-service";
import { toast } from "sonner";
import LoadingSpinner from "@/src/components/LoadingSpinner";
import { useLanguage } from "@/src/context/LanguageContext";
import RequiredStar from "@/src/components/atoms/RequiredStar";
import { StudentService } from "@/src/lib/api/student-service";

interface AddScoreModalProps {
  onClose: () => void;
  onSave: (newScore: Omit<ClassResult, "id">) => Promise<void>;
  studentIdParam?: string;
  classCodeParam?: string;
}

const AddScoreModal: React.FC<AddScoreModalProps> = ({
  onClose,
  onSave,
  studentIdParam,
  classCodeParam,
}) => {
  const [scoreData, setScoreData] = useState<ClassResult>({
    studentId: studentIdParam || "",
    classCode: classCodeParam || "",
    score: 0,
    factor: 0.5,
    type: "MIDTERM",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [students, setStudents] = useState<
    Array<{ id: string; studentId: string; name: string }>
  >([]);
  const [classes, setClasses] = useState<
    Array<{ code: string; title: string }>
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Load students list (first page with many items)
        const studentService = new StudentService(language);
        const studentsResponse = await studentService.getAll(["page=1", "limit=1000"]);
        if (studentsResponse.statusCode === 200) {
          setStudents(
            studentsResponse.data.data.map((student) => ({
              id: student.id || "",
              studentId: student.studentId,
              name: student.name,
            })),
          );
        }

        // Load classes list
        const classService = new ClassService(language);
        const classesResponse = await classService.getAll();
        if (classesResponse.statusCode === 200) {
          setClasses(
            classesResponse.data.data.map((cls) => ({
              code: cls.code,
              title: cls.classroom,
            })),
          );
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    // Convert number fields to actual numbers
    if (name === "score" || name === "factor") {
      setScoreData({
        ...scoreData,
        [name]: parseFloat(value),
      });
    } else {
      setScoreData({
        ...scoreData,
        [name]: value,
      });
    }
  };

  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate the data
    if (!scoreData.studentId) {
      toast.error(t("StudentResults_AddModal_Error_StudentId"));
      setIsSubmitting(false);
      return;
    }

    if (!scoreData.classCode) {
      toast.error(t("StudentResults_AddModal_Error_ClassCode"));
      setIsSubmitting(false);
      return;
    }

    if (scoreData.score < 0 || scoreData.score > 10) {
      toast.error(t("StudentResults_AddModal_Error_Score"));
      setIsSubmitting(false);
      return;
    }

    if (scoreData.factor <= 0 || scoreData.factor > 1) {
      toast.error(t("StudentResults_AddModal_Error_GradeFactor"));
      setIsSubmitting(false);
      return;
    }

    try {
      await onSave(scoreData);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {t("StudentResults_AddModal_Title")}
        </h2>

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Label className="block text-sm font-medium text-gray-700 mb-1">
                {t("StudentResults_AddModal_Form_Student")} <RequiredStar />
              </Label>
              <Select
                name="studentId"
                value={scoreData.studentId}
                onValueChange={(value) =>
                  setScoreData({ ...scoreData, studentId: value })
                }
                required
                disabled={!!studentIdParam}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={t(
                      "StudentResults_AddModal_Form_StudentPlaceholder",
                    )}
                  />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.studentId}>
                      {student.studentId} - {student.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="mb-4">
              <Label className="block text-sm font-medium text-gray-700 mb-1">
                {t("StudentResults_AddModal_Form_ClassCode")} <RequiredStar />
              </Label>
              <Select
                name="classCode"
                value={scoreData.classCode}
                onValueChange={(value) =>
                  setScoreData({ ...scoreData, classCode: value })
                }
                required
                disabled={!!classCodeParam}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={t(
                      "StudentResults_AddModal_Form_ClassCodePlaceholder",
                    )}
                  />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls.code} value={cls.code}>
                      {cls.code} - {cls.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="mb-4">
              <Label className="block text-sm font-medium text-gray-700 mb-1">
                {t("StudentResults_AddModal_Form_GradeType")} <RequiredStar />
              </Label>
              <Select
                name="type"
                value={scoreData.type}
                onValueChange={(value: ClassResult["type"]) =>
                  setScoreData({ ...scoreData, type: value })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={mapScoreTypeToLabel(scoreData.type)}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MIDTERM">
                    {mapScoreTypeToLabel("MIDTERM")}
                  </SelectItem>
                  <SelectItem value="FINALTERM">
                    {mapScoreTypeToLabel("FINALTERM")}
                  </SelectItem>
                  <SelectItem value="OTHER">
                    {mapScoreTypeToLabel("OTHER")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="mb-4">
              <Label
                htmlFor="factor"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t("StudentResults_AddModal_Form_GradeFactor")} (0-1){" "}
                <RequiredStar />
              </Label>
              <Input
                type="number"
                name="factor"
                value={scoreData.factor}
                onChange={handleChange}
                min="0"
                max="1"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div className="mb-6">
              <Label
                htmlFor="score"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t("StudentResults_AddModal_Form_Grade")} (0-10){" "}
                <RequiredStar />
              </Label>
              <Input
                type="number"
                name="score"
                value={scoreData.score}
                onChange={handleChange}
                min="0"
                max="10"
                step="0.1"
                required
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                variant="secondary"
              >
                {t("cancelBtn")}
              </Button>
              <Button type="submit" variant="default" disabled={isSubmitting}>
                {isSubmitting ? t("saving") : t("addBtn")}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddScoreModal;
